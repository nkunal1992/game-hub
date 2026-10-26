import { globalCell, SAFE, type LudoColor } from './board'

export type RulesVariant = 'classic' | 'kids'
export type Difficulty = 'easy' | 'smart'
export type Phase = 'roll' | 'move' | 'over'

export const BASE = -1
export const FINISHED = 56
export const TOKENS_PER_SEAT = 4

export interface Seat {
  color: LudoColor
  name: string
  avatar: string
  isComputer: boolean
  difficulty: Difficulty
}

export type GameEvent =
  | { type: 'roll'; seat: number; value: number }
  | { type: 'leave-base'; seat: number; token: number }
  | { type: 'move'; seat: number; token: number; from: number; to: number }
  | { type: 'capture'; seat: number; victims: { seat: number; token: number }[] }
  | { type: 'finish'; seat: number; token: number }
  | { type: 'extra-turn'; seat: number }
  | { type: 'forfeit'; seat: number }
  | { type: 'no-moves'; seat: number }
  | { type: 'win'; seat: number }

export interface GameState {
  seats: Seat[]
  /** tokens[seat][0..3] — progress: -1 base, 0–50 track, 51–55 home col, 56 done */
  tokens: number[][]
  turn: number
  dice: number | null
  phase: Phase
  sixStreak: number
  winner: number | null
  rules: RulesVariant
  /** Last event batch — drives UI toasts/animation hints. */
  events: GameEvent[]
}

export function newGame(seats: Seat[], rules: RulesVariant): GameState {
  return {
    seats,
    tokens: seats.map(() => Array(TOKENS_PER_SEAT).fill(BASE)),
    turn: 0,
    dice: null,
    phase: 'roll',
    sixStreak: 0,
    winner: null,
    rules,
    events: [],
  }
}

function nextTurn(state: GameState): number {
  return (state.turn + 1) % state.seats.length
}

/** Destination progress for a token, or null if the move is illegal. */
export function destination(
  rules: RulesVariant,
  progress: number,
  dice: number,
): number | null {
  if (progress === FINISHED) return null
  if (progress === BASE) {
    if (rules === 'classic' && dice !== 6) return null
    return 0 // leave base onto the start square
  }
  const dest = progress + dice
  if (dest <= FINISHED) return dest
  // Overshoot — kids rules let a big roll carry the token home.
  return rules === 'kids' ? FINISHED : null
}

/** Indices of tokens the current player may legally move. */
export function legalMoves(state: GameState): number[] {
  if (state.dice === null || state.phase !== 'move') return []
  const list: number[] = []
  state.tokens[state.turn].forEach((p, i) => {
    if (destination(state.rules, p, state.dice!) !== null) list.push(i)
  })
  return list
}

export function rollDice(state: GameState, value: number): GameState {
  if (state.phase !== 'roll' || state.winner !== null) return state
  const sixStreak = value === 6 ? state.sixStreak + 1 : 0

  // Classic: three 6s in a row forfeits the whole turn.
  if (state.rules === 'classic' && sixStreak === 3) {
    return {
      ...state,
      turn: nextTurn(state),
      dice: null,
      phase: 'roll',
      sixStreak: 0,
      events: [
        { type: 'roll', seat: state.turn, value },
        { type: 'forfeit', seat: state.turn },
      ],
    }
  }

  const next: GameState = {
    ...state,
    dice: value,
    phase: 'move',
    sixStreak,
    events: [{ type: 'roll', seat: state.turn, value }],
  }
  if (legalMoves(next).length === 0) {
    // No legal moves — turn passes (extra roll still granted on a 6).
    const extra = value === 6
    return {
      ...next,
      turn: extra ? state.turn : nextTurn(state),
      dice: null,
      phase: 'roll',
      sixStreak: extra ? sixStreak : 0,
      events: [...next.events, { type: 'no-moves', seat: state.turn }],
    }
  }
  return next
}

export function applyMove(
  state: GameState,
  tokenIndex: number,
): { state: GameState; events: GameEvent[] } {
  if (state.phase !== 'move' || state.dice === null || state.winner !== null) {
    return { state, events: [] }
  }
  if (!legalMoves(state).includes(tokenIndex)) return { state, events: [] }

  const seat = state.turn
  const color = state.seats[seat].color
  const from = state.tokens[seat][tokenIndex]
  const to = destination(state.rules, from, state.dice)!
  const events: GameEvent[] = []

  const tokens = state.tokens.map((row) => [...row])
  tokens[seat][tokenIndex] = to
  events.push(
    from === BASE
      ? { type: 'leave-base', seat, token: tokenIndex }
      : { type: 'move', seat, token: tokenIndex, from, to },
  )
  if (to === FINISHED) events.push({ type: 'finish', seat, token: tokenIndex })

  // Captures — only on non-safe main-track cells.
  const cell = globalCell(color, to)
  if (cell !== null && !SAFE.has(cell)) {
    const victims: { seat: number; token: number }[] = []
    tokens.forEach((row, s) => {
      if (s === seat) return
      row.forEach((p, t) => {
        if (globalCell(state.seats[s].color, p) === cell) {
          victims.push({ seat: s, token: t })
          tokens[s][t] = BASE
        }
      })
    })
    if (victims.length) events.push({ type: 'capture', seat, victims })
  }

  const won = tokens[seat].every((p) => p === FINISHED)
  const extra = !won && state.dice === 6

  const next: GameState = {
    ...state,
    tokens,
    turn: won || extra ? seat : nextTurn(state),
    dice: null,
    phase: won ? 'over' : 'roll',
    sixStreak: extra ? state.sixStreak : 0,
    winner: won ? seat : null,
    events,
  }
  if (won) events.push({ type: 'win', seat })
  else if (extra) events.push({ type: 'extra-turn', seat })
  return { state: next, events }
}

/** Seat scores used by the side panel. */
export function seatSummary(state: GameState, seat: number) {
  const row = state.tokens[seat]
  return {
    base: row.filter((p) => p === BASE).length,
    track: row.filter((p) => p >= 0 && p <= 55).length,
    home: row.filter((p) => p === FINISHED).length,
  }
}
