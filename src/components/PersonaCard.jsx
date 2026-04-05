// PersonaCard.jsx
// Renders a single investor persona with their attack text and defense input.
// Phase 2: shows streaming text as it arrives token by token.
// Phase 3: shows score + reasoning after defense is submitted.

import DefenseInput from './DefenseInput'

const COLOR_MAP = {
  coral: 'var(--coral)',
  amber: 'var(--amber)',
  blue:  'var(--blue)',
  pink:  'var(--pink)',
  green: 'var(--green)',
}

export default function PersonaCard({
  persona,
  attackText,     // string | null — full attack (done streaming)
  streamingText,  // string | null — in-progress streaming text
  isLoading,      // bool — waiting for first token
  isScoring,      // bool — scoring API call in progress
  score,          // number | null — defense score 0-20
  reasoning,      // string | null — why this score
  onDefend,
  pitchSubmitted,
}) {
  const accentColor = COLOR_MAP[persona.color] || 'var(--text-secondary)'

  // What to show in the attack body
  const displayText = attackText ?? streamingText
  const showSkeleton  = isLoading && !streamingText
  const showEmpty     = !pitchSubmitted

  return (
    <div
      className={`persona-card ${isLoading ? 'loading' : ''}`}
      style={{ '--accent': accentColor }}
    >
      {/* Header */}
      <div className="persona-card-header">
        <span className="persona-emoji" aria-hidden="true">{persona.emoji}</span>
        <div>
          <p className="persona-name">{persona.name}</p>
          <p className="persona-role">{persona.role}</p>
        </div>

        {/* Score badge */}
        {isScoring && (
          <span className="persona-score" style={{ marginLeft: 'auto', opacity: 0.5 }}>
            scoring...
          </span>
        )}
        {!isScoring && score !== null && score !== undefined && (
          <span
            className="persona-score"
            style={{ marginLeft: 'auto', color: accentColor }}
            title={reasoning ?? ''}
          >
            {score}/20
          </span>
        )}
      </div>

      {/* Tagline */}
      <p className="persona-tagline">"{persona.tagline}"</p>

      {/* Attack body */}
      {showEmpty && (
        <p className="persona-attack empty">Waiting for your pitch...</p>
      )}

      {showSkeleton && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skeleton" style={{ height: 12, width: '90%' }} />
          <div className="skeleton" style={{ height: 12, width: '75%' }} />
          <div className="skeleton" style={{ height: 12, width: '82%' }} />
        </div>
      )}

      {displayText && (
        <p className="persona-attack">
          {displayText}
          {/* Blinking cursor while streaming */}
          {streamingText && !attackText && (
            <span style={{
              display: 'inline-block',
              width: 2,
              height: '1em',
              background: accentColor,
              marginLeft: 2,
              verticalAlign: 'text-bottom',
              animation: 'pulse 0.8s ease-in-out infinite',
            }} />
          )}
        </p>
      )}

      {/* Score reasoning — shows below the attack once scored */}
      {reasoning && (
        <p style={{
          fontSize: 11,
          color: accentColor,
          fontFamily: 'var(--font-mono)',
          borderLeft: `2px solid ${accentColor}`,
          paddingLeft: 8,
          opacity: 0.8,
          lineHeight: 1.4,
        }}>
          {reasoning}
        </p>
      )}

      {/* Defense input — only after attacked */}
      {pitchSubmitted && (
        <DefenseInput
          personaId={persona.id}
          disabled={isLoading || isScoring}
          onSubmit={onDefend}
        />
      )}
    </div>
  )
}