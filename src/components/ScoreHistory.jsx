// ScoreHistory.jsx
// Shows previous pitch attempts with their scores.
// Lets judges see the iteration loop in action.

export default function ScoreHistory({ history }) {
  if (history.length === 0) return null

  return (
    <div style={{ marginBottom: 40 }}>
      <p className="section-label" style={{ marginBottom: 14 }}>Previous Attempts</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {history.map((attempt, index) => (
          <div key={index} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Attempt number */}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              minWidth: 24,
            }}>
              #{index + 1}
            </span>

            {/* Pitch text */}
            <span style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {attempt.pitch}
            </span>

            {/* Score */}
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              color: attempt.band.color,
              minWidth: 60,
              textAlign: 'right',
            }}>
              {attempt.score}
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/100</span>
            </span>

            {/* Band label */}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: attempt.band.color,
              minWidth: 120,
              textAlign: 'right',
            }}>
              {attempt.band.label.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}