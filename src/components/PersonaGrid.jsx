// PersonaGrid.jsx
// Renders all 5 PersonaCard components in a responsive grid.

import { PERSONAS } from '../data/personas'
import PersonaCard from './PersonaCard'

export default function PersonaGrid({
  attacks,        // { [personaId]: string } — full attack text
  streamingText,  // { [personaId]: string } — in-progress streaming text
  loadingIds,     // Set<string> — which personas are still waiting to start
  scoringIds,     // Set<string> — which personas are being scored right now
  scores,         // { [personaId]: number } — defense scores 0-20
  reasoning,      // { [personaId]: string } — score reasoning from Claude
  onDefend,       // (personaId, defenseText) => void
  pitchSubmitted, // bool
}) {
  return (
    <div className="persona-grid">
      {PERSONAS.map(persona => (
        <PersonaCard
          key={persona.id}
          persona={persona}
          attackText={attacks[persona.id] ?? null}
          streamingText={streamingText[persona.id] ?? null}
          isLoading={loadingIds.has(persona.id)}
          isScoring={scoringIds.has(persona.id)}
          score={scores[persona.id] ?? null}
          reasoning={reasoning[persona.id] ?? null}
          onDefend={onDefend}
          pitchSubmitted={pitchSubmitted}
        />
      ))}
    </div>
  )
}