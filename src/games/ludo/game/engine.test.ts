import { describe, expect, it } from 'vitest'
import {
  BASE,
  FINISHED,
  applyMove,
  destination,
  legalMoves,
  newGame,
  rollDice,
  seatSummary,
  type GameState,
  type Seat,
} from './engine'

const seat = (color: Seat['color'], name?: string): Seat => ({
  color,
  name: name ?? color,
  avatar: '😎',
  isComputer: false,
  difficulty: 'smart',
})

const twoSeats = (): Seat[] => [seat('red', 'Ada'), seat('yellow', 'Bo')]

function gameWith(partial: Partial<GameState>) {
  return { ...newGame(twoSeats(), 'classic'), ...partial }
}

describe('leaving base', () => {
  it('classic: needs a 6 to leave base', () => {
    let s = newGame(twoSeats(), 'classic')
    s = rollDice(s, 5)
    expect(s.turn).toBe(1) // no moves → turn passed
    s = rollDice(s, 6)
    expect(s.turn).toBe(1)
    expect(legalMoves(s)).toEqual([0, 1, 2, 3])
    const { state } = applyMove(s, 0)
    expect(state.tokens[1][0]).toBe(0)
    expect(state.turn).toBe(1) // 6 → extra roll
  })

  it('kids: any roll leaves base', () => {
    let s = newGame(twoSeats(), 'kids')
    s = rollDice(s, 2)
    expect(legalMoves(s)).toHaveLength(4)
    const { state } = applyMove(s, 0)
    expect(state.tokens[0][0]).toBe(0)
  })
})

describe('destination', () => {
  it('classic requires exact roll to finish', () => {
    expect(destination('classic', 54, 2)).toBe(56)
    expect(destination('classic', 54, 5)).toBeNull()
    expect(destination('kids', 54, 5)).toBe(56)
  })

  it('rejects moving a finished token', () => {
    expect(destination('classic', 56, 6)).toBeNull()
  })
})

describe('sixes', () => {
  it('grants an extra turn on a 6', () => {
    let s = gameWith({ tokens: [[0, BASE, BASE, BASE], [BASE, BASE, BASE, BASE]] })
    s = rollDice(s, 6)
    const { state } = applyMove(s, 0)
    expect(state.turn).toBe(0)
    expect(state.phase).toBe('roll')
  })

  it('classic: three 6s forfeit the turn', () => {
    let s = gameWith({ tokens: [[0, BASE, BASE, BASE], [BASE, BASE, BASE, BASE]] })
    s = rollDice(s, 6)
    s = applyMove(s, 0).state
    s = rollDice(s, 6)
    s = applyMove(s, 0).state
    s = rollDice(s, 6) // third six
    expect(s.turn).toBe(1)
    expect(s.events.some((e) => e.type === 'forfeit')).toBe(true)
    expect(s.dice).toBeNull()
  })

  it('kids: no three-6s forfeit', () => {
    let s = gameWith({ rules: 'kids', tokens: [[0, BASE, BASE, BASE], [BASE, BASE, BASE, BASE]] })
    s = rollDice(s, 6)
    s = applyMove(s, 0).state
    s = rollDice(s, 6)
    s = applyMove(s, 0).state
    s = rollDice(s, 6)
    expect(s.turn).toBe(0)
    expect(s.phase).toBe('move')
  })
})

describe('captures', () => {
  it('sends an opponent token home on a non-safe cell', () => {
    // yellow token sits on global cell 6 (red progress 6), not safe
    let s = gameWith({
      tokens: [[5, BASE, BASE, BASE], [BASE, BASE, BASE, BASE]],
    })
    // put yellow on cell 6: yellow start 26, need progress p with (26+p)%52=6 → p=32
    s.tokens[1][0] = 32
    s = rollDice(s, 1) // red 5→6 lands on cell 6
    const { state } = applyMove(s, 0)
    expect(state.tokens[1][0]).toBe(BASE)
    expect(state.events.some((e) => e.type === 'capture')).toBe(true)
  })

  it('does not capture on a safe star cell', () => {
    // put yellow on global cell 8 (safe): (26+p)%52=8 → p=34
    let s = gameWith({
      tokens: [[7, BASE, BASE, BASE], [BASE, BASE, BASE, BASE]],
    })
    s.tokens[1][0] = 34
    s = rollDice(s, 1) // red 7→8 → cell 8 (safe)
    const { state } = applyMove(s, 0)
    expect(state.tokens[1][0]).toBe(34)
    expect(state.events.some((e) => e.type === 'capture')).toBe(false)
  })

  it('own tokens may stack anywhere', () => {
    let s = gameWith({
      tokens: [[3, 5, BASE, BASE], [BASE, BASE, BASE, BASE]],
    })
    s = rollDice(s, 2) // token0: 3→5 where token1 already sits
    const { state } = applyMove(s, 0)
    expect(state.tokens[0][0]).toBe(5)
    expect(state.tokens[0][1]).toBe(5)
  })
})

describe('win detection', () => {
  it('ends the game when all 4 tokens finish', () => {
    let s = gameWith({
      tokens: [[55, 56, 56, 56], [BASE, BASE, BASE, BASE]],
    })
    s = rollDice(s, 1)
    const { state } = applyMove(s, 0)
    expect(state.winner).toBe(0)
    expect(state.phase).toBe('over')
    expect(state.events.some((e) => e.type === 'win')).toBe(true)
  })
})

describe('turn flow', () => {
  it('auto-passes when roll yields no legal moves', () => {
    let s = gameWith({
      tokens: [[54, 56, 56, 56], [BASE, BASE, BASE, BASE]],
    })
    s = rollDice(s, 5) // classic: 54+5 > 56 → no moves
    expect(s.turn).toBe(1)
    expect(s.events.some((e) => e.type === 'no-moves')).toBe(true)
  })

  it('seatSummary counts base/track/home tokens', () => {
    const s = gameWith({
      tokens: [[-1, -1, 20, 56], [BASE, BASE, BASE, BASE]],
    })
    expect(seatSummary(s, 0)).toEqual({ base: 2, track: 1, home: 1 })
  })
})

describe('simulated full games', () => {
  it('classic game between two heuristic players terminates with a winner', () => {
    const seats: Seat[] = [
      { ...seat('red'), isComputer: true },
      { ...seat('yellow'), isComputer: true },
    ]
    let s = newGame(seats, 'classic')
    let rngState = 42
    const rng = () => (rngState = (rngState * 1103515245 + 12345) % 2147483648) / 2147483648
    let steps = 0
    while (s.winner === null && steps < 5000) {
      if (s.phase === 'roll') s = rollDice(s, 1 + Math.floor(rng() * 6))
      else {
        const moves = legalMoves(s)
        const pick = moves[Math.floor(rng() * moves.length)]
        s = applyMove(s, pick).state
      }
      steps++
    }
    expect(s.winner).not.toBeNull()
    expect(s.tokens[s.winner!].every((p) => p === FINISHED)).toBe(true)
  })

  it('kids game also terminates with a winner', () => {
    let s = newGame(twoSeats(), 'kids')
    let rngState = 7
    const rng = () => (rngState = (rngState * 1103515245 + 12345) % 2147483648) / 2147483648
    let steps = 0
    while (s.winner === null && steps < 5000) {
      if (s.phase === 'roll') s = rollDice(s, 1 + Math.floor(rng() * 6))
      else s = applyMove(s, legalMoves(s)[0]).state
      steps++
    }
    expect(s.winner).not.toBeNull()
  })
})
