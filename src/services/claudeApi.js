// claudeApi.js
// Uses Groq API (free) with llama-3.3-70b model.
// Strict scoring based on actual response content — no randomness.

import { PERSONAS } from '../data/personas'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

function getApiKey() {
    const key = import.meta.env.VITE_GROQ_API_KEY
    if (!key) throw new Error('Missing VITE_GROQ_API_KEY in .env file')
    return key
}

// ── Core Groq call ────────────────────────────────────────────
async function callGroq(systemPrompt, userMessage, maxTokens = 300) {
    const res = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getApiKey()}`,
        },
        body: JSON.stringify({
            model: MODEL,
            max_tokens: maxTokens,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
        }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `Groq API error ${res.status}`)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content ?? ''
}

// ── Single persona attack ─────────────────────────────────────
async function attackWithPersona(persona, pitchText) {
    const userMessage = `A founder pitched this idea:\n\n"${pitchText}"\n\nAttack it from your perspective. Be brutal and specific. 2-3 sentences only.`
    return callGroq(persona.systemPrompt, userMessage, 200)
}

// ── Public: fire all 5 attacks in parallel ────────────────────
export async function attackAllPersonas(pitchText, onPersonaReady, onChunk) {
    const promises = PERSONAS.map(async (persona) => {
        try {
            const text = await attackWithPersona(persona, pitchText)
            // Simulate word-by-word streaming for visual effect
            const words = text.split(' ')
            for (let i = 0; i < words.length; i++) {
                // Faster at start, slight pause at punctuation for dramatic effect
                const word = words[i]
                const delay = word.endsWith('.') || word.endsWith('?') || word.endsWith('—')
                    ? 180
                    : i < 5 ? 25 : 45
                await new Promise(r => setTimeout(r, delay))
                onChunk?.(persona.id, word + ' ')
            }
            onPersonaReady(persona.id, text)
            return { id: persona.id, text }
        } catch (err) {
            const fallback = `⚠️ ${err.message}`
            onPersonaReady(persona.id, fallback)
            return { id: persona.id, text: fallback }
        }
    })

    const results = await Promise.allSettled(promises)
    return Object.fromEntries(
        results.map((r, i) => [
            PERSONAS[i].id,
            r.status === 'fulfilled' ? r.value.text : '⚠️ Failed to load.'
        ])
    )
}

// ── Public: strict scoring based on actual defense text ───────
export async function scoreDefense(personaId, attackText, defenseText) {
    const persona = PERSONAS.find(p => p.id === personaId)

    const systemPrompt = `You are a strict startup pitch evaluator. Score a founder's defense against an investor attack.

Score out of 20 using these exact criteria:
- Clarity (0-7): Is the response clear, direct, and easy to understand?
- Evidence (0-7): Do they use specific data, numbers, or real examples?
- Market awareness (0-6): Do they show understanding of competitors, risks, or market?

A vague or generic response scores 0-8.
A decent response with some specifics scores 9-14.
A strong response with data and sharp thinking scores 15-20.

Respond ONLY with valid JSON, no extra text:
{"score": <number 0-20>, "reasoning": "<one sentence max>"}`

    const userMessage = `Persona: ${persona?.name}

Their attack:
"${attackText}"

Founder's defense:
"${defenseText}"

Score this defense strictly.`

    try {
        const raw = await callGroq(systemPrompt, userMessage, 150)
        const clean = raw.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)
        const score = Math.min(20, Math.max(0, Math.round(Number(parsed.score))))
        return { score, reasoning: parsed.reasoning ?? '' }
    } catch {
        // If JSON parsing fails, try to extract just a number from the response
        return { score: 10, reasoning: 'Could not parse score.' }
    }
}