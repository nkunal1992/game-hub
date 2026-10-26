import { globalCell, SAFE } from './board'
import {
  BASE,
  FINISHED,
  destination,
  legalMoves,
  type GameState,
} from './engine'

function capturesAt(state: GameState, seat: number, dest: number): number {
  const cell = globalCell(state.seats[seat].color, dest)
  if (cell === null || SAFE.has(cell)) return 0
  let n = 0
  state.tokens.forEach((row, s) => {
    if (s === seat) return
    row.forEach((p) => {
      if (globalCell(state.seats[s].color, p) === cell) n++
    })
  })
  return n
}

/** Heuristic score for moving `token` — used by the 'smart' difficulty. */
function scoreMove(state: GameState, seat: number, token: number): number {
  const from = state.tokens[seat][token]
  const to = destination(state.rules, from, state.dice!)!
  const myCell = globalCell(state.seats[seat].color, from)
  let s = to * 0.4 // favour advancing the furthest tokens
  if (to === FINISHED) s += 100
  if (to >= 51 && to < FINISHED) s += 30 // slip into the safe home column
  const captured = capturesAt(state, seat, to)
  if (captured) s += 60 * captured
  if (from === BASE) s += 25 // get tokens out
  const destCell = globalCell(state.seats[seat].color, to)
  if (destCell !== null && SAFE.has(destCell)) s += 15 // land on a star
  if (myCell !== null && !SAFE.has(myCell)) s += 12 // leave a dangerous spot
  return s
}

export function chooseToken(
  state: GameState,
  rng: () => number = Math.random,
): number | null {
  const moves = legalMoves(state)
  if (!moves.length) return null
  if (state.seats[state.turn].difficulty === 'easy') {
    return moves[Math.floor(rng() * moves.length)]
  }
  let best = moves[0]
  let bestScore = -Infinity
  for (const t of moves) {
    const s = scoreMove(state, state.turn, t) + rng() * 4 // small tie-break noise
    if (s > bestScore) {
      bestScore = s
      best = t
    }
  }
  return best
}
