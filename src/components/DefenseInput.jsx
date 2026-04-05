// DefenseInput.jsx
// The defense text area + submit button shown inside each PersonaCard.
// Phase 1: controlled input, calls onSubmit when user clicks "Defend".
// Phase 3: onSubmit will trigger the scoring API call.

import { useState } from 'react'

export default function DefenseInput({ personaId, disabled, onSubmit }) {
  const [text, setText] = useState('')

  function handleSubmit() {
    if (!text.trim()) return
    onSubmit(personaId, text.trim())
    // Note: we intentionally do NOT clear the text — user may want to refine it.
  }

  return (
    <div className="defense-section">
      <p className="defense-label">Your defense</p>
      <textarea
        className="defense-textarea"
        placeholder="Counter their attack..."
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={disabled}
        rows={3}
      />
      <button
        className="btn-defend"
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
      >
        Defend ↗
      </button>
    </div>
  )
}