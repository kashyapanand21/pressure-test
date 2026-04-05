import DefenseInput from './DefenseInput'

const COLOR_MAP = {
  coral: 'var(--coral)',
  amber: 'var(--amber)',
  blue:  'var(--blue)',
  pink:  'var(--pink)',
  green: 'var(--green)',
}

export default function PersonaCard({
  persona, attackText, streamingText, isLoading,
  isScoring, score, reasoning, onDefend, pitchSubmitted,
}) {
  const accentColor = COLOR_MAP[persona.color] || 'var(--text-secondary)'
  const displayText = attackText ?? streamingText
  const showSkeleton = isLoading && !streamingText
  const showEmpty = !pitchSubmitted

  return (
    <div
      className={`persona-card ${isLoading ? 'loading' : ''}`}
      style={{ '--accent': accentColor }}
    >
      {/* Header */}
      <div className="persona-card-header">
        <div className="persona-header-left">
          <div className="persona-emoji-wrap">{persona.emoji}</div>
          <div>
            <div className="persona-name">{persona.name}</div>
            <div className="persona-role">{persona.title}</div>
            <div className="persona-org">{persona.org}</div>
          </div>
        </div>

        {/* Score */}
        {isScoring && (
          <div className="persona-score-wrap">
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>
              scoring...
            </span>
          </div>
        )}
        {!isScoring && score !== null && score !== undefined && (
          <div className="persona-score-wrap">
            <div className="persona-score" style={{ color: accentColor }}>{score}</div>
            <div className="persona-score-sub">/20</div>
          </div>
        )}
      </div>

      {/* Tagline */}
      <p className="persona-tagline">"{persona.tagline}"</p>

      {/* Attack */}
      {showEmpty && <p className="persona-attack empty">Waiting for your pitch...</p>}

      {showSkeleton && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div className="skeleton" style={{ height: 11, width: '92%' }} />
          <div className="skeleton" style={{ height: 11, width: '78%' }} />
          <div className="skeleton" style={{ height: 11, width: '85%' }} />
          <div className="skeleton" style={{ height: 11, width: '60%' }} />
        </div>
      )}

      {displayText && (
        <p className="persona-attack">
          {displayText}
          {streamingText && !attackText && (
            <span style={{
              display: 'inline-block', width: 2, height: '1em',
              background: accentColor, marginLeft: 2,
              verticalAlign: 'text-bottom',
              animation: 'pulse 0.7s ease-in-out infinite',
            }} />
          )}
        </p>
      )}

      {/* Reasoning */}
      {reasoning && (
        <p className="persona-reasoning" style={{ color: accentColor }}>
          {reasoning}
        </p>
      )}

      {/* Defense */}
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