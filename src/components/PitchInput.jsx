// PitchInput.jsx
// The main pitch submission box at the top of the app.
// Phase 1: controlled textarea + submit button.
// Phase 2: onSubmit triggers parallel Claude API calls.

import { useState } from 'react'

const MAX_CHARS = 400
const PLACEHOLDER =
  'Describe your startup in 3 sentences. What it does, who it\'s for, and how it makes money...'

export default function PitchInput({ onSubmit, disabled }) {
  const [pitch, setPitch] = useState('')

  function handleSubmit() {
    const trimmed = pitch.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  function handleKeyDown(e) {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit()
    }
  }

  const remaining = MAX_CHARS - pitch.length
  const isOverLimit = remaining < 0

  return (
    <div className="pitch-section">
      <p className="section-label">Your Startup Pitch</p>
      <div className="pitch-box">
        <textarea
          className="pitch-textarea"
          placeholder={PLACEHOLDER}
          value={pitch}
          onChange={e => setPitch(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          maxLength={MAX_CHARS + 50} // soft limit; hard limit enforced below
          rows={4}
          aria-label="Startup pitch"
        />
        <div className="pitch-footer">
          <span
            className="char-count"
            style={{ color: isOverLimit ? 'var(--score-red)' : undefined }}
          >
            {isOverLimit ? `${Math.abs(remaining)} over limit` : `${remaining} chars left`}
          </span>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={disabled || !pitch.trim() || isOverLimit}
          >
            FACE THE PANEL →
          </button>
        </div>
      </div>
      <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
        Tip: Be specific. Vague pitches get destroyed faster. ⌘ + Enter to submit.
      </p>
    </div>
  )
}