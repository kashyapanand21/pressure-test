// FundabilityMeter.jsx
// Displays the 0–100 score bar with color-coded bands.
// Phase 1: receives score as prop, purely presentational.

import { getScoreBand, SCORE_BANDS } from '../data/personas'

export default function FundabilityMeter({ score }) {
  const band = getScoreBand(score)

  return (
    <div className="meter-section">
      <p className="section-label">Fundability Meter</p>

      <div className="meter-header">
        <span
          className="meter-score"
          style={{ color: band.color }}
        >
          {score}
          <span style={{ fontSize: 24, color: 'var(--text-muted)', marginLeft: 4 }}>/100</span>
        </span>
        <span className="meter-label" style={{ color: band.color }}>
          {band.label}
        </span>
      </div>

      <div className="meter-track">
        <div
          className="meter-fill"
          style={{
            width: `${score}%`,
            backgroundColor: band.color,
          }}
        />
      </div>

      <div className="meter-bands">
        {SCORE_BANDS.map(b => (
          <span
            key={b.min}
            className="meter-band-label"
            style={{ color: score >= b.min && score <= b.max ? b.color : undefined }}
          >
            {b.min}
          </span>
        ))}
        <span className="meter-band-label">100</span>
      </div>
    </div>
  )
}