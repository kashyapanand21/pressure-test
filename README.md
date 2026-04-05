# Pressure Test 🎯
### AI-Powered Startup Idea Validator — Project Jupyter Hackathon

Pitch your startup idea. Face 5 brutal AI investor personas. Defend yourself. Get your Fundability Score.

---

## What It Does

Most founders get honest feedback too late — after months of building the wrong thing. Pressure Test puts you in front of 5 ruthless AI investors before it counts. You pitch, they attack, you defend, you get scored. Lose? Refine and go again.

---

## The 5 Investor Personas

| Persona | Role | Attack Angle |
|---|---|---|
| 🤨 Marcus Thorne | Managing Partner, Blackwood VC | Willingness to pay |
| 📉 Sarah Chen | GP, Apex | Market size & TAM |
| ⚙️ Dr. Aris Varma | Head of Deep Tech, Capital | Technical feasibility |
| ⚖️ Jung Moon | Partner, Ventures | Ethics & harm |
| 🗡️ Elena Rossi | Venture Partner, Frontier | Competitive moat |

---

## Fundability Score

| Score | Band |
|---|---|
| 0 – 35 | Back to Drawing Board |
| 36 – 60 | Needs Major Refinement |
| 61 – 80 | Promising — Keep Iterating |
| 81 – 100 | Investor Ready |

Each persona scores your defense out of 20 across **clarity**, **evidence quality**, and **market awareness**.

---

## Tech Stack

- **Frontend** — React + Vite
- **AI Engine** — Groq API (llama-3.3-70b-versatile)
- **Scoring** — Custom rubric via separate AI call per defense
- **Architecture** — Parallel API calls, all 5 personas attack simultaneously

---

## Features

- ⚡ Simultaneous attacks from all 5 personas
- 📊 Live Fundability Index updates as you defend
- 🔄 Re-pitch and iterate — session history tracks improvement
- 🛡️ Demo Mode — full pre-run session with zero API calls
- 📋 Copy your pitch with one click
- 🏆 Share your score card
- ⚙️ Settings — update profile and Groq API key from UI

---

## Getting Started

```bash
git clone https://github.com/your-username/pressure-test
cd pressure-test
npm install
```

Create a `.env` file:

```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get a free Groq API key at [console.groq.com](https://console.groq.com)

```bash
npm run dev
```

---

## Demo Mode

Toggle **Demo Mode** in the top banner to load a full pre-run session instantly — no API calls. Use this during live demos to avoid rate limiting.

---

## Project Structure

```
src/
├── components/
│   ├── PitchInput.jsx       # Pitch textarea + submit
│   ├── PersonaGrid.jsx      # 5 investor cards
│   ├── PersonaCard.jsx      # Individual card + defense input
│   ├── FundabilityMeter.jsx # Live score bar
│   ├── DefenseInput.jsx     # Defense textarea per persona
│   ├── ScoreHistory.jsx     # Session history widget
│   └── DemoToggle.jsx       # Demo mode banner + toggle
├── data/
│   ├── personas.js          # Persona definitions + score bands
│   └── demoData.js          # Pre-run demo session data
├── services/
│   ├── claudeApi.js         # Groq API calls + scoring
│   └── scoring.js           # Total score calculation
├── hooks/
│   └── useDebate.js
├── App.jsx
└── App.css
```

---

## Built By

**Anand Kashyap** — NIT Patna  
Project Jupyter Hackathon, 2025