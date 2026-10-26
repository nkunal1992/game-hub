import { CELLS, LADDERS, SNAKES } from './board'
import type { LudoColor } from '../../ludo/game/board'

export type Phase = 'roll' | 'over'

export interface Seat {
  color: LudoColor
  name: string
  avatar: string
  isComputer: boolean
}

export type GameEvent =
  | { type: 'roll'; seat: number; value: number }
  | { type: 'move'; seat: number; from: number; to: number }
  | { type: 'ladder'; seat: number; from: number; to: number }
  | { type: 'snake'; seat: number; from: number; to: number }
  | { type: 'overshoot'; seat: number; needed: number }
  | { type: 'win'; seat: number }

export interface GameState {
  seats: Seat[]
  /** Current cell per seat — all start off-board at 0. */
  pos: number[]
  turn: number
  dice: number | null
  phase: Phase
  winner: number | null
  events: GameEvent[]
}

export function newGame(seats: Seat[]): GameState {
  return {
    seats,
    pos: seats.map(() => 0),
    turn: 0,
    dice: null,
    phase: 'roll',
    winner: null,
    events: [],
  }
}

export function rollDice(state: GameState, value: number): GameState {
  if (state.phase !== 'roll' || state.winner !== null) return state

  const seat = state.turn
  const from = state.pos[seat]
  const events: GameEvent[] = [{ type: 'roll', seat, value }]

  const landing = from + value
  // Must land exactly on 100 — overshooting skips the turn.
  if (landing > CELLS) {
    events.push({ type: 'overshoot', seat, needed: CELLS - from })
    return {
      ...state,
      turn: (seat + 1) % state.seats.length,
      dice: value,
      events,
    }
  }

  const pos = [...state.pos]
  pos[seat] = landing
  events.push({ type: 'move', seat, from, to: landing })

  const ladderTo = LADDERS[landing]
  const snakeTo = SNAKES[landing]
  if (ladderTo !== undefined) {
    pos[seat] = ladderTo
    events.push({ type: 'ladder', seat, from: landing, to: ladderTo })
  } else if (snakeTo !== undefined) {
    pos[seat] = snakeTo
    events.push({ type: 'snake', seat, from: landing, to: snakeTo })
  }

  const won = pos[seat] === CELLS
  if (won) events.push({ type: 'win', seat })

  return {
    ...state,
    pos,
    turn: won ? seat : (seat + 1) % state.seats.length,
    dice: value,
    phase: won ? 'over' : 'roll',
    winner: won ? seat : null,
    events,
  }
}
