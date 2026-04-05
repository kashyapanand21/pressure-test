import { useState } from 'react'
import PitchInput from './components/PitchInput'
import PersonaGrid from './components/PersonaGrid'
import FundabilityMeter from './components/FundabilityMeter'
import ScoreHistory from './components/ScoreHistory'
import DemoToggle from './components/DemoToggle'
import { attackAllPersonas, scoreDefense } from './services/claudeApi'
import { calcTotalScore } from './services/scoring'
import { getScoreBand } from './data/personas'
import {
  DEMO_PITCH,
  DEMO_SESSION,
  DEMO_HISTORY_ENTRY,
} from './data/demoData'

// ─── Methodology View ─────────────────────────────────────────
function MethodologyView() {
  const personas = [
    { icon: '🤨', name: 'Marcus Thorne', role: 'Managing Partner', firm: 'Blackwood VC', color: '#ef4444', attack: 'Prove it. Why will anyone actually pay for this?', focus: 'Validates real customer demand and willingness to pay.' },
    { icon: '📉', name: 'Sarah Chen', role: 'Sr. Operational Alpha', firm: 'Apex', color: '#f97316', attack: "Your TAM is wrong. The market doesn't work how you think.", focus: 'Challenges market size assumptions and go-to-market logic.' },
    { icon: '⚙️', name: 'Dr. Aris Varma', role: 'Head of Deep Tech', firm: 'Capital', color: '#3b82f6', attack: 'Can this even be built in 6 months with your team?', focus: 'Stress-tests technical feasibility and team capability.' },
    { icon: '⚖️', name: 'Jung Moon', role: 'Partner · Impact Thesis', firm: 'Ventures', color: '#ec4899', attack: 'Have you considered the harm this could cause?', focus: 'Probes ethical risks, regulation, and societal impact.' },
    { icon: '🗡️', name: 'Elena Rossi', role: 'Venture Partner', firm: 'Frontier', color: '#22c55e', attack: "Google/Uber/Amazon already does this. What's your moat?", focus: 'Attacks competitive differentiation and defensibility.' },
  ]

  return (
    <div className="page-content">
      <div className="methodology-header">
        <p className="section-label">Methodology · How Scoring Works</p>
        <h2 className="methodology-title">THE INTERROGATION FRAMEWORK</h2>
        <p className="methodology-sub">
          Each investor persona attacks your pitch from a distinct angle. Your defense is scored on clarity, evidence quality, and market awareness.
        </p>
      </div>
      <div className="scoring-bands-section">
        <p className="section-label">Fundability Bands</p>
        <div className="scoring-bands-grid">
          {[
            { range: '0 – 35', label: 'Back to Drawing Board', color: '#ef4444' },
            { range: '36 – 60', label: 'Needs Major Refinement', color: '#f97316' },
            { range: '61 – 80', label: 'Promising — Keep Iterating', color: '#eab308' },
            { range: '81 – 100', label: 'Investor Ready', color: '#22c55e' },
          ].map(band => (
            <div key={band.range} className="band-card" style={{ borderColor: band.color + '40', background: band.color + '08' }}>
              <div className="band-range" style={{ color: band.color }}>{band.range}</div>
              <div className="band-label">{band.label}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="section-label">The Panel · 5 Investor Personas</p>
      <div className="panel-section">
        <div className="persona-methodology-grid">
          {personas.map(p => (
            <div key={p.name} className="persona-method-card" style={{ borderColor: p.color + '40' }}>
              <div className="persona-method-top">
                <span className="persona-method-icon">{p.icon}</span>
                <div>
                  <div className="persona-method-name">{p.name}</div>
                  <div className="persona-method-role" style={{ color: p.color }}>{p.role} · {p.firm}</div>
                </div>
              </div>
              <div className="persona-method-attack">"{p.attack}"</div>
              <div className="persona-method-focus">{p.focus}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── History View ─────────────────────────────────────────────
function HistoryView({ history }) {
  function formatDate(date) {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  }
  if (history.length === 0) {
    return (
      <div className="page-content">
        <p className="section-label">Validation History · All Sessions</p>
        <div className="empty-history">
          <div className="empty-history-icon">◷</div>
          <p className="empty-history-title">NO SESSIONS YET</p>
          <p className="empty-history-sub">Submit a pitch and defend against all 5 investors to record your first session.</p>
        </div>
      </div>
    )
  }
  return (
    <div className="page-content">
      <p className="section-label">Validation History · {history.length} Session{history.length !== 1 ? 's' : ''}</p>
      <div className="history-full-grid">
        {[...history].reverse().map((attempt, index) => (
          <div key={index} className="history-full-card">
            <div className="history-full-left">
              <div className="history-full-session">SESSION #{history.length - index}</div>
              <div className="history-full-date">{formatDate(attempt.date)}</div>
              <div className="history-full-score" style={{ color: attempt.band.color }}>
                {attempt.score}<span className="history-full-denom">/100</span>
              </div>
              <div className="history-badge" style={{ color: attempt.band.color, background: `${attempt.band.color}15`, border: `1px solid ${attempt.band.color}40` }}>
                {attempt.score >= 81 ? 'INVESTOR READY' : attempt.score >= 61 ? 'PROMISING' : attempt.score >= 36 ? 'NEEDS WORK' : 'BACK TO DRAWING BOARD'}
              </div>
            </div>
            <div className="history-full-pitch">
              <div className="history-pitch-label">PITCH</div>
              <div className="history-pitch-text">{attempt.pitch}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Settings View ────────────────────────────────────────────
function SettingsView() {
  const [name, setName] = useState(() => localStorage.getItem('pt_name') || 'Anand Kashyap')
  const [role, setRole] = useState(() => localStorage.getItem('pt_role') || 'Founder')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('pt_groq_key') || '')
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)

  function handleSave() {
    localStorage.setItem('pt_name', name)
    localStorage.setItem('pt_role', role)
    if (apiKey.trim()) localStorage.setItem('pt_groq_key', apiKey.trim())
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }
  function handleCancel() {
    setName(localStorage.getItem('pt_name') || 'Anand Kashyap')
    setRole(localStorage.getItem('pt_role') || 'Founder')
    setApiKey(localStorage.getItem('pt_groq_key') || '')
    setEditing(false)
  }

  return (
    <div className="page-content">
      <p className="section-label">Settings · Configuration</p>
      <div className="settings-section">
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-title">USER PROFILE</div>
            {!editing && <button className="settings-edit-btn" onClick={() => setEditing(true)}>Edit</button>}
          </div>
          <div className="settings-row">
            <span className="settings-key">Name</span>
            {editing ? <input className="settings-input" value={name} onChange={e => setName(e.target.value)} /> : <span className="settings-val">{name}</span>}
          </div>
          <div className="settings-row">
            <span className="settings-key">Role</span>
            {editing ? <input className="settings-input" value={role} onChange={e => setRole(e.target.value)} /> : <span className="settings-val">{role}</span>}
          </div>
        </div>
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-title">GROQ API KEY</div>
          </div>
          <div className="settings-row settings-row-col">
            <span className="settings-key">API Key</span>
            <div className="settings-key-row">
              <input
                className="settings-input settings-input-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder={editing ? 'gsk_...' : apiKey ? '••••••••••••••••' : 'Not set — using .env'}
                disabled={!editing}
              />
              <button className="settings-show-btn" onClick={() => setShowKey(s => !s)}>
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            {!apiKey && !editing && <span className="settings-hint">Falling back to VITE_GROQ_API_KEY in .env</span>}
          </div>
        </div>
        <div className="settings-card">
          <div className="settings-card-title">SYSTEM</div>
          <div className="settings-row"><span className="settings-key">Model</span><span className="settings-val">llama-3.3-70b-versatile</span></div>
          <div className="settings-row"><span className="settings-key">Provider</span><span className="settings-val">Groq API</span></div>
          <div className="settings-row"><span className="settings-key">Version</span><span className="settings-val">Pressure Test v1.0</span></div>
          <div className="settings-row"><span className="settings-key">Hackathon</span><span className="settings-val">Project Jupyter</span></div>
        </div>
        {editing && (
          <div className="settings-actions">
            <button className="settings-cancel-btn" onClick={handleCancel}>Cancel</button>
            <button className="settings-save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        )}
        {saved && <div className="settings-saved">✓ Saved successfully</div>}
      </div>
    </div>
  )
}

// ─── Dashboard View ───────────────────────────────────────────
function DashboardView({ pitchSubmitted, isAttacking, error, attacks, streamingText, loadingIds, scoringIds, scores, reasoning, totalScore, history, onSubmit, onDefend, demoMode, currentPitch }) {
  function handleShareScore() {
    const text = `🎯 Pressure Test Result\n\nPitch: "${currentPitch.slice(0, 100)}..."\n\nFundability Score: ${totalScore}/100\n${totalScore >= 81 ? '✅ Investor Ready' : totalScore >= 61 ? '🔶 Promising' : totalScore >= 36 ? '🔸 Needs Work' : '❌ Back to Drawing Board'}\n\nTested at Pressure Test — Project Jupyter Hackathon`

    if (navigator.share) {
      navigator.share({ title: 'My Pressure Test Score', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Score card copied to clipboard!')
    }
  }
  return (
    <div className="page-content">
      {error && <div className="error-banner">⚠ {error}</div>}
      <PitchInput onSubmit={onSubmit} disabled={isAttacking || demoMode} defaultValue={demoMode ? currentPitch : ''} />
      {pitchSubmitted && currentPitch && (
        <div className="copy-pitch-bar">
          <span className="copy-pitch-text">"{currentPitch.slice(0, 60)}..."</span>
          <button
            className="copy-pitch-btn"
            onClick={() => {
              navigator.clipboard.writeText(currentPitch)
                .then(() => alert('Pitch copied!'))
            }}
          >
            Copy My Pitch
          </button>
        </div>
      )}
      {pitchSubmitted && Object.keys(scores).length === 5 && (
        <button className="share-score-btn" onClick={handleShareScore}>
          Share Score Card 🏆
        </button>
      )}
      <FundabilityMeter score={totalScore} />
      <div className="panel-section">
        <p className="section-label">The Panel · Active Interrogation</p>
        <PersonaGrid
          attacks={attacks}
          streamingText={streamingText}
          loadingIds={loadingIds}
          scoringIds={scoringIds}
          scores={scores}
          reasoning={reasoning}
          onDefend={onDefend}
          pitchSubmitted={pitchSubmitted}
        />
      </div>
      {history.length > 0 && <ScoreHistory history={history} />}
      {!pitchSubmitted && !demoMode && (
        <div className="empty-state">
          <p className="empty-state-eyebrow">Project Jupyter · Hackathon</p>
          <p className="empty-state-title">READY TO BE DESTROYED?</p>
          <p className="empty-state-sub">Pitch your startup above. 5 ruthless AI investors will attack it simultaneously.</p>
        </div>
      )}
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────
export default function App() {
  const [pitchSubmitted, setPitchSubmitted] = useState(false)
  const [loadingIds, setLoadingIds] = useState(new Set())
  const [scoringIds, setScoringIds] = useState(new Set())
  const [attacks, setAttacks] = useState({})
  const [streamingText, setStreamingText] = useState({})
  const [scores, setScores] = useState({})
  const [reasoning, setReasoning] = useState({})
  const [totalScore, setTotalScore] = useState(0)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [currentPitch, setCurrentPitch] = useState('')
  const [sessionId, setSessionId] = useState(0)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [demoMode, setDemoMode] = useState(false)

  function activateDemo() {
    setPitchSubmitted(true)
    setCurrentPitch(DEMO_PITCH)
    setAttacks(DEMO_SESSION.attacks)
    setStreamingText({})
    setScores(DEMO_SESSION.scores)
    setReasoning(DEMO_SESSION.reasoning)
    setTotalScore(DEMO_SESSION.totalScore)
    setLoadingIds(new Set())
    setScoringIds(new Set())
    setError(null)
    setHistory([DEMO_HISTORY_ENTRY])
    setActiveNav('dashboard')
  }

  function handleDemoToggle() {
    if (!demoMode) {
      setDemoMode(true)
      activateDemo()
    } else {
      setDemoMode(false)
      handleReset()
    }
  }

  async function handlePitchSubmit(pitchText) {
    if (demoMode) return
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
          setStreamingText(prev => { const n = { ...prev }; delete n[personaId]; return n })
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
    if (demoMode) return
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
    setHistory([])
    setCurrentPitch('')
    setActiveNav('dashboard')
  }

  const isAttacking = loadingIds.size > 0

  function renderView() {
    switch (activeNav) {
      case 'history': return <HistoryView history={history} />
      case 'personas': return <MethodologyView />
      case 'settings': return <SettingsView />
      default: return (
        <DashboardView
          pitchSubmitted={pitchSubmitted}
          isAttacking={isAttacking}
          error={error}
          attacks={attacks}
          streamingText={streamingText}
          loadingIds={loadingIds}
          scoringIds={scoringIds}
          scores={scores}
          reasoning={reasoning}
          totalScore={totalScore}
          history={history}
          onSubmit={handlePitchSubmit}
          onDefend={handleDefend}
          demoMode={demoMode}
          currentPitch={currentPitch}
        />
      )
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-title">PRESSURE TEST</div>
          <div className="sidebar-logo-sub">Startup Validator</div>
        </div>
        <div className="sidebar-user">
          <div className="sidebar-avatar">AK</div>
          <div>
            <div className="sidebar-user-name">{localStorage.getItem('pt_name') || 'Anand Kashyap'}</div>
            <div className="sidebar-user-role">● {localStorage.getItem('pt_role') || 'Founder'}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '▦' },
            { id: 'history', label: 'History', icon: '◷' },
            { id: 'personas', label: 'Methodology', icon: '◈' },
            { id: 'settings', label: 'Settings', icon: '⊙' },
          ].map(item => (
            <div key={item.id} className={`sidebar-nav-item ${activeNav === item.id ? 'active' : ''}`} onClick={() => setActiveNav(item.id)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-new-btn" onClick={handleReset} disabled={demoMode}>
            + New Analysis
          </button>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-breadcrumb">
            {activeNav === 'dashboard' && 'Input · Startup Pitch / Value Proposition'}
            {activeNav === 'history' && 'History · Validation Sessions'}
            {activeNav === 'personas' && 'Methodology · Investor Framework'}
            {activeNav === 'settings' && 'Settings · Configuration'}
          </div>
          <div className="topbar-right">
            <div className="status-badge">
              <div className="status-dot" />
              System Status · Operational
            </div>
            {pitchSubmitted && activeNav === 'dashboard' && !demoMode && (
              <button className="btn-reset" onClick={handleReset}>Reset</button>
            )}
          </div>
        </div>

        <DemoToggle enabled={demoMode} onToggle={handleDemoToggle} />
        {renderView()}
      </div>
    </div>
  )
}