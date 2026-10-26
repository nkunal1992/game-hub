import type { Player } from './logic'
import type { Scores } from '../types'

export type MatchFormat = 'free' | 'bo3' | 'bo5'

export const MATCH_FORMATS: ReadonlyArray<{
  value: MatchFormat
  label: string
  hint: string
}> = [
  { value: 'free', label: 'Free play', hint: 'Endless rounds' },
  { value: 'bo3', label: 'Best of 3', hint: 'First to 2' },
  { value: 'bo5', label: 'Best of 5', hint: 'First to 3' },
]

/** Wins needed to clinch the match, or null for endless play. */
export function winsNeeded(format: MatchFormat): number | null {
  switch (format) {
    case 'bo3':
      return 2
    case 'bo5':
      return 3
    case 'free':
      return null
  }
}

/** Symbol that clinched the match, or null while it's still open. */
export function seriesWinner(scores: Scores, format: MatchFormat): Player | null {
  const needed = winsNeeded(format)
  if (needed === null) return null
  if (scores.X >= needed) return 'X'
  if (scores.O >= needed) return 'O'
  return null
}
