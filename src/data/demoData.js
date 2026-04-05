// demoData.js
// Full pre-run session for Demo Mode.
// Activated when demoMode is ON — zero API calls made.

import { getScoreBand } from './personas'

export const DEMO_PITCH = `We're building MockMate — an AI-powered mock interview platform for final-year engineering students at tier-2 and tier-3 colleges in India who have zero access to placement prep coaches. Students practice technical and HR interviews with AI personas, get scored on clarity and depth, and receive actionable feedback. We charge ₹299/month — less than one coaching session.`

export const DEMO_ATTACKS = {
  skeptic: `₹299/month sounds affordable until you realize tier-2 college students are price-sensitive to the point of using cracked software — they will not pay monthly for interview prep when YouTube is free. Show me a paying cohort, not a survey that says "yes I would pay."`,
  market: `"Final-year engineering students at tier-2 colleges" sounds big until you segment it — students who both need this AND will pay AND aren't already covered by college placement cells is maybe 800,000 people. At ₹299/month with 5% conversion that's ₹14 crore ARR ceiling before churn, which in EdTech is brutal.`,
  tech: `AI mock interviews that are actually useful require real-time speech recognition in Indian accents, domain-aware question generation across 40+ engineering specializations, and feedback that doesn't feel robotic — none of that is solved by wrapping GPT in a form. What's your plan when the AI gives confidently wrong technical feedback and a student bombs their actual interview?`,
  ethics: `You're targeting students at their most anxious and vulnerable moment — final year placements — and scoring their confidence and communication with an AI that has known biases against non-native English speakers and regional accents. If your model systematically underscores students from Bihar or Odisha, you're not helping them, you're gaslighting them before a real interview.`,
  competitor: `Interview Buddy, Interviewing.io, Pramp, and iMocha all exist. Unstop literally does this for Indian college students with 10 million users already on the platform. Your differentiator is "tier-2 focus" — that's a distribution strategy, not a moat. What stops Unstop from adding a ₹199 tier next quarter?`,
}

export const DEMO_DEFENSES = {
  skeptic: `We ran a 3-week pilot at NIT Patna and LNCT Bhopal — 340 students, 23% converted to paid at ₹199 introductory price. Retention at 30 days was 61%. These aren't survey responses — these are students who opened their UPI app. The pain is real: 73% of our pilot users had never done a single mock interview before using MockMate.`,
  market: `You're right that the total addressable number shrinks on segmentation — we're not chasing all 1.5 million engineering graduates. Our beachhead is 800,000 students at NIRF-ranked tier-2 institutions with active placement cells. At 10% conversion that's ₹28 crore ARR, and that's before we expand to upskilling and lateral hiring, which triples the TAM.`,
  tech: `We're not wrapping GPT blindly. We fine-tuned on 4,000 actual placement interview transcripts sourced from students across 12 colleges — including accent-diverse audio. Our feedback system flags low-confidence scores for human review in the first version rather than serving them raw. We ship the 80% solution that works, not the perfect system that doesn't exist yet.`,
  ethics: `This is the concern we take most seriously, which is why we built a bias audit into our scoring pipeline from day one. We test every model update against a held-out set of regional accent recordings and flag score drift above 8%. We also show students the rubric — transparency is the baseline. No black box scoring.`,
  competitor: `Unstop is a hiring marketplace — mock interviews are a side feature, not their core loop. Interview Buddy costs ₹2,499/month and targets metro professionals. We're going deep on one segment they've all ignored: the student who's never had a coach, never done a mock, and has 90 days until placement season. First-mover depth beats breadth here.`,
}

const DEMO_SCORES = {
  skeptic:    { score: 16, reasoning: 'Strong — real pilot data with conversion numbers is exactly what this persona needed to hear.' },
  market:     { score: 13, reasoning: 'Decent segmentation recovery, but ARR projection still feels optimistic without churn data.' },
  tech:       { score: 15, reasoning: 'Solid — fine-tuning on real transcripts and graceful degradation shows technical maturity.' },
  ethics:     { score: 17, reasoning: 'Excellent — proactive bias auditing with specific thresholds is the right answer.' },
  competitor: { score: 14, reasoning: 'Good positioning, but didn\'t fully address what stops Unstop from copying the model.' },
}

// Pre-calculate total score (out of 100)
const rawTotal = Object.values(DEMO_SCORES).reduce((sum, s) => sum + s.score, 0)
export const DEMO_TOTAL_SCORE = rawTotal // 75

export const DEMO_HISTORY_ENTRY = {
  sessionId: 'demo',
  pitch: DEMO_PITCH,
  score: DEMO_TOTAL_SCORE,
  band: getScoreBand(DEMO_TOTAL_SCORE),
  date: new Date(),
}

// Shape matches what App.jsx expects
export const DEMO_SESSION = {
  attacks:   DEMO_ATTACKS,
  defenses:  DEMO_DEFENSES,
  scores:    Object.fromEntries(Object.entries(DEMO_SCORES).map(([id, s]) => [id, s.score])),
  reasoning: Object.fromEntries(Object.entries(DEMO_SCORES).map(([id, s]) => [id, s.reasoning])),
  totalScore: DEMO_TOTAL_SCORE,
}