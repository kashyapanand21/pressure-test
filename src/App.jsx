// App.jsx
// Root component. Owns all debate state.
// Phase 1: simulated attacks, fake scoring.
// Phase 2: real Claude API calls.
// Phase 3: real defense scoring.

import { useState } from 'react'
import PitchInput from './components/PitchInput'
import PersonaGrid from './components/PersonaGrid'
import FundabilityMeter from './components/FundabilityMeter'
import { attackAllPersonas, scoreDefense } from './services/claudeApi'
import { getScoreBand } from './data/personas'
import ScoreHistory from './components/ScoreHistory'
import { calcTotalScore } from './services/scoring'

// ── App state shape ─────────────────────────────────────────
// pitch:          string   — current pitch text
// pitchSubmitted: bool     — has user submitted a pitch
// isAttacking:    bool     — waiting for ALL personas to respond
// loadingIds:     Set      — which persona ids are still loading
// attacks:        {}       — { personaId: attackText }
// defenses:       {}       — { personaId: defenseText }
// scores:         {}       — { personaId: score 0-20 }
// totalScore:     number   — 0-100

export default function App() {
  const [pitchSubmitted, setPitchSubmitted] = useState(false)
  const [loadingIds, setLoadingIds] = useState(new Set())
  const [scoringIds, setScoringIds] = useState(new Set())
  const [attacks, setAttacks] = useState({})
  // streamingText holds in-progress text before the full response arrives
  const [streamingText, setStreamingText] = useState({})
  const [scores, setScores] = useState({})
  const [reasoning, setReasoning] = useState({})
  const [totalScore, setTotalScore] = useState(0)
  const [error, setError] = useState(null)
  const [currentPitch, setCurrentPitch] = useState('')
  const [history, setHistory] = useState([])

  // ── Handle pitch submission ──────────────────────────────
  async function handlePitchSubmit(pitchText) {
    setPitchSubmitted(true)
    setCurrentPitch(pitchText)
    setAttacks({})
    setStreamingText({})
    setScores({})
    setReasoning({})
    setTotalScore(0)
    setError(null)

    const { PERSONAS } = await import('./data/personas')
    setLoadingIds(new Set(PERSONAS.map(p => p.id)))

    try {
      await attackAllPersonas(
        pitchText,
        // onPersonaReady — full text done, move out of loading
        (personaId, attackText) => {
          setAttacks(prev => ({ ...prev, [personaId]: attackText }))
          setStreamingText(prev => { const n = { ...prev }; delete n[personaId]; return n })
          setLoadingIds(prev => {
            const next = new Set(prev)
            next.delete(personaId)
            return next
          })
        },
        // onChunk — append streaming token to that card
        (personaId, chunk) => {
          setStreamingText(prev => ({
            ...prev,
            [personaId]: (prev[personaId] ?? '') + chunk,
          }))
        }
      )
    } catch (err) {
      setError(err.message)
      setLoadingIds(new Set())
    }
  }

  // ── Handle defense submission ────────────────────────────
  async function handleDefend(personaId, defenseText) {
    const attackText = attacks[personaId]
    setScoringIds(prev => new Set([...prev, personaId]))

    try {
      const { score, reasoning: reason } = await scoreDefense(personaId, attackText, defenseText)

      setScores(prev => {
        const isNewScore = !prev[personaId]
        const updated = { ...prev, [personaId]: score }
        const newTotal = calcTotalScore(updated)
        setTotalScore(newTotal)

        // Only save to history when all 5 are scored for the first time
        if (Object.keys(updated).length === 5 && isNewScore) {
          setHistory(h => [...h, {
            pitch: currentPitch,
            score: newTotal,
            band: getScoreBand(newTotal),
          }])
        }

        return updated
      })
      setReasoning(prev => ({ ...prev, [personaId]: reason }))
    } catch (err) {
      setError(err.message)
    } finally {
      setScoringIds(prev => {
        const next = new Set(prev)
        next.delete(personaId)
        return next
      })
    }
  }

  const isAttacking = loadingIds.size > 0

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="logo-group">
          <h1 className="logo-title">PRESSURE TEST</h1>
          <p className="logo-sub">AI Startup Idea Validator · Project Jupyter</p>
        </div>
        {pitchSubmitted && (
          <button
            className="btn-submit"
            style={{ fontSize: 14, padding: '8px 20px' }}
            onClick={() => {
              setPitchSubmitted(false)
              setAttacks({})
              setStreamingText({})
              setScores({})
              setReasoning({})
              setTotalScore(0)
              setLoadingIds(new Set())
              setScoringIds(new Set())
              setError(null)
            }}
          >
            RESET →
          </button>
        )}
      </header>

      {/* ── Error banner ── */}
      {error && (
        <div style={{
          background: 'rgba(226,75,74,0.12)',
          border: '1px solid var(--score-red)',
          borderRadius: 'var(--r-md)',
          padding: '12px 16px',
          marginBottom: 24,
          color: 'var(--score-red)',
          fontSize: 13,
          fontFamily: 'var(--font-mono)',
        }}>
          ⚠ {error}
        </div>
      )}

      {/* ── Pitch input ── */}
      <PitchInput
        onSubmit={handlePitchSubmit}
        disabled={isAttacking}
      />

      {/* ── Fundability Meter ── */}
      <FundabilityMeter score={totalScore} />

      {/* ── Persona grid ── */}
      <p className="section-label" style={{ marginBottom: 14 }}>
        The Panel
      </p>
      <PersonaGrid
        attacks={attacks}
        streamingText={streamingText}
        loadingIds={loadingIds}
        scoringIds={scoringIds}
        scores={scores}
        reasoning={reasoning}
        onDefend={handleDefend}
        pitchSubmitted={pitchSubmitted}
      />

      <ScoreHistory history={history} />

      {/* ── Empty state ── */}
      {!pitchSubmitted && (
        <div className="empty-state">
          <p className="empty-state-title">READY TO BE DESTROYED?</p>
          <p className="empty-state-sub">
            Pitch your startup above. 5 ruthless AI investors are waiting.
          </p>
        </div>
      )}
    </div>
  )
}