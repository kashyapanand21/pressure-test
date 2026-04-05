import { useState } from 'react'
import PitchInput from './components/PitchInput'
import PersonaGrid from './components/PersonaGrid'
import FundabilityMeter from './components/FundabilityMeter'
import ScoreHistory from './components/ScoreHistory'
import { attackAllPersonas, scoreDefense } from './services/claudeApi'
import { calcTotalScore } from './services/scoring'
import { getScoreBand } from './data/personas'

export default function App() {
  const [pitchSubmitted, setPitchSubmitted]   = useState(false)
  const [loadingIds, setLoadingIds]           = useState(new Set())
  const [scoringIds, setScoringIds]           = useState(new Set())
  const [attacks, setAttacks]                 = useState({})
  const [streamingText, setStreamingText]     = useState({})
  const [scores, setScores]                   = useState({})
  const [reasoning, setReasoning]             = useState({})
  const [totalScore, setTotalScore]           = useState(0)
  const [error, setError]                     = useState(null)
  const [history, setHistory]                 = useState([])
  const [currentPitch, setCurrentPitch]       = useState('')
  const [sessionId, setSessionId]             = useState(0)
  const [activeNav, setActiveNav]             = useState('dashboard')

  async function handlePitchSubmit(pitchText) {
    setPitchSubmitted(true)
    setCurrentPitch(pitchText)
    setSessionId(s => s + 1)
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
        (personaId, attackText) => {
          setAttacks(prev => ({ ...prev, [personaId]: attackText }))
          setStreamingText(prev => { const n = {...prev}; delete n[personaId]; return n })
          setLoadingIds(prev => { const next = new Set(prev); next.delete(personaId); return next })
        },
        (personaId, chunk) => {
          setStreamingText(prev => ({ ...prev, [personaId]: (prev[personaId] ?? '') + chunk }))
        }
      )
    } catch (err) {
      setError(err.message)
      setLoadingIds(new Set())
    }
  }

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
        if (Object.keys(updated).length === 5 && isNewScore) {
          const finalScore = newTotal
          setTimeout(() => {
            setHistory(h => {
              const alreadySaved = h.some(a => a.sessionId === sessionId)
              if (alreadySaved) return h
              return [...h, { sessionId, pitch: currentPitch, score: finalScore, band: getScoreBand(finalScore), date: new Date() }]
            })
          }, 0)
        }
        return updated
      })
      setReasoning(prev => ({ ...prev, [personaId]: reason }))
    } catch (err) {
      setError(err.message)
    } finally {
      setScoringIds(prev => { const next = new Set(prev); next.delete(personaId); return next })
    }
  }

  function handleReset() {
    setPitchSubmitted(false)
    setAttacks({})
    setStreamingText({})
    setScores({})
    setReasoning({})
    setTotalScore(0)
    setLoadingIds(new Set())
    setScoringIds(new Set())
    setError(null)
  }

  const isAttacking = loadingIds.size > 0

  return (
    <div className="app-shell">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-title">PRESSURE TEST</div>
          <div className="sidebar-logo-sub">Startup Validator</div>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">AK</div>
          <div>
            <div className="sidebar-user-name">Anand Kashyap</div>
            <div className="sidebar-user-role">● Founder</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '▦' },
            { id: 'history',   label: 'History',   icon: '◷' },
            { id: 'personas',  label: 'Methodology', icon: '◈' },
            { id: 'settings',  label: 'Settings',  icon: '⊙' },
          ].map(item => (
            <div
              key={item.id}
              className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-new-btn" onClick={handleReset}>
            + New Analysis
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-content">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-breadcrumb">
            Input · Startup Pitch / Value Proposition
          </div>
          <div className="topbar-right">
            <div className="status-badge">
              <div className="status-dot" />
              System Status · Operational
            </div>
            {pitchSubmitted && (
              <button className="btn-reset" onClick={handleReset}>Reset</button>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="page-content">

          {error && <div className="error-banner">⚠ {error}</div>}

          {/* Pitch input */}
          <PitchInput onSubmit={handlePitchSubmit} disabled={isAttacking} />

          {/* Fundability Meter */}
          <FundabilityMeter score={totalScore} />

          {/* Persona grid */}
          <div className="panel-section">
            <p className="section-label">The Panel · Active Interrogation</p>
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
          </div>

          {/* History */}
          {history.length > 0 && (
            <ScoreHistory history={history} />
          )}

          {/* Empty state */}
          {!pitchSubmitted && (
            <div className="empty-state">
              <p className="empty-state-eyebrow">Project Jupyter · Hackathon</p>
              <p className="empty-state-title">READY TO BE DESTROYED?</p>
              <p className="empty-state-sub">
                Pitch your startup above. 5 ruthless AI investors will attack it simultaneously.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}