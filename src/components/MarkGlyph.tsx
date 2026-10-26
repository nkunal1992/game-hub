import type { Player } from '../game/logic'
import { markDef } from '../marks'

interface MarkGlyphProps {
  mark: string
  /** Which seat's color to use for shape strokes. */
  seat: Player
  ghost?: boolean
  /** Compact inline display (picker chips, scoreboard). */
  mini?: boolean
}

export default function MarkGlyph({ mark, seat, ghost = false, mini = false }: MarkGlyphProps) {
  const def = markDef(mark)
  const cls = [
    'mark',
    `mark--${seat.toLowerCase()}`,
    def.kind === 'emoji' ? 'mark--emoji' : 'mark--shape',
    ghost ? 'mark--ghost' : '',
    mini ? 'mark--mini' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (def.kind === 'emoji') {
    return (
      <svg viewBox="0 0 100 100" className={cls} aria-hidden="true">
        <text x="50" y="54" textAnchor="middle" dominantBaseline="central" fontSize="64">
          {def.emoji}
        </text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 100" className={cls} aria-hidden="true">
      {def.paths!.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          className={`mark-stroke mark-stroke--${i + 1}`}
        />
      ))}
    </svg>
  )
}
