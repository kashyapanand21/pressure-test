export default function ScoreHistory({ history }) {
  if (history.length === 0) return null

  function formatDate(date) {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase()
  }

  return (
    <div className="history-section">
      <p className="section-label">Validation History</p>
      <div className="history-grid">
        {history.map((attempt, index) => (
          <div key={index} className="history-card">
            <div className="history-date">{formatDate(attempt.date)}</div>
            <div className="history-score" style={{ color: attempt.band.color }}>
              {attempt.score}
            </div>
            <div
              className="history-badge"
              style={{
                color: attempt.band.color,
                background: `${attempt.band.color}15`,
                border: `1px solid ${attempt.band.color}40`,
              }}
            >
              {attempt.score >= 81 ? 'PASS' :
               attempt.score >= 61 ? 'MK2' :
               attempt.score >= 36 ? 'RAIN' : 'FAIL'}
            </div>
            <div className="history-pitch">{attempt.pitch}</div>
          </div>
        ))}
      </div>
    </div>
  )
}