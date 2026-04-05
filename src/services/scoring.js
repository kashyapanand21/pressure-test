// scoring.js
// Phase 3: full scoring logic lives here.
// Phase 1/2: just calculates total from per-persona scores.

/**
 * Sums per-persona scores (each 0–20) into a total 0–100.
 * @param {{ [personaId]: number }} scoreMap
 */
export function calcTotalScore(scoreMap) {
  const total = Object.values(scoreMap).reduce((sum, s) => sum + (s || 0), 0)
  return Math.min(100, Math.max(0, total))
}