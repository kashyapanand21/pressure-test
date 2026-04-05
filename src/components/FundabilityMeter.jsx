import { getScoreBand, SCORE_BANDS } from '../data/personas'

const TOTAL_SEGMENTS = 20

export default function FundabilityMeter({ score }) {
  const band = getScoreBand(score)
  const filledSegments = Math.round((score / 100) * TOTAL_SEGMENTS)

  // Color per segment position
  function segmentColor(i) {
    const pct = (i / TOTAL_SEGMENTS) * 100
    if (pct < 35)  return '#ff3333'
    if (pct < 60)  return '#f5a623'
    if (pct < 80)  return '#2d8cff'
    return '#3aad5a'
  }

  return (
    <div className="meter-section">
      <div className="meter-top">
        <div>
          <div className="meter-title">FUNDABILITY INDEX</div>
          <div className="meter-subtitle">Global Market Assessment & Structural Integrity</div>
        </div>
        <div className="meter-score-group">
          <div
            className="meter-risk-badge"
            style={{ color: band.color, borderColor: band.color, background: `${band.color}15` }}
          >
            {band.label}
          </div>
          <div>
            <span className="meter-score" style={{ color: band.color }}>{score}</span>
            <span className="meter-score-denom">/100</span>
          </div>
        </div>
      </div>

      {/* Segmented bar */}
      <div className="meter-segments">
        {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
          <div
            key={i}
            className="meter-segment"
            style={{
              background: i < filledSegments ? segmentColor(i) : undefined,
              opacity: i < filledSegments ? 1 : 0.15,
            }}
          />
        ))}
      </div>

      <div className="meter-band-labels">
        <span className="meter-band-label" style={{ color: score <= 35 ? '#ff3333' : undefined }}>0 — Drawing Board</span>
        <span className="meter-band-label" style={{ color: score > 35 && score <= 60 ? '#f5a623' : undefined }}>36 — Refinement</span>
        <span className="meter-band-label" style={{ color: score > 60 && score <= 80 ? '#2d8cff' : undefined }}>61 — Promising</span>
        <span className="meter-band-label" style={{ color: score > 80 ? '#3aad5a' : undefined }}>81 — Investor Ready</span>
      </div>
    </div>
  )
}