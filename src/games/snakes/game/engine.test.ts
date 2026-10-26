import { describe, expect, it } from 'vitest'
import { CELLS, LADDERS, SNAKES, cellCoord } from './board'
import { newGame, rollDice, type Seat } from './engine'

const seat = (color: Seat['color'], name?: string): Seat => ({
  color,
  name: name ?? color,
  avatar: '😎',
  isComputer: false,
})

const twoSeats = (): Seat[] => [seat('red', 'Ada'), seat('blue', 'Bo')]

describe('serpentine numbering', () => {
  it('places 1 at bottom-left and 10 at bottom-right', () => {
    expect(cellCoord(1)).toEqual([9, 0])
    expect(cellCoord(10)).toEqual([9, 9])
  })

  it('snakes the second row right-to-left', () => {
    expect(cellCoord(11)).toEqual([8, 9])
    expect(cellCoord(20)).toEqual([8, 0])
  })

  it('places 100 at top-left', () => {
    expect(cellCoord(100)).toEqual([0, 0])
    expect(cellCoord(91)).toEqual([0, 9])
  })

  it('covers every cell exactly once', () => {
    const seen = new Set(Array.from({ length: CELLS }, (_, i) => cellCoord(i + 1).join(',')))
    expect(seen.size).toBe(100)
  })

  it('ladders always climb up and snakes always drop', () => {
    for (const [from, to] of Object.entries(LADDERS)) expect(to).toBeGreaterThan(+from)
    for (const [from, to] of Object.entries(SNAKES)) expect(to).toBeLessThan(+from)
    // no cell is both a ladder base and a snake head
    for (const k of Object.keys(LADDERS)) expect(SNAKES[+k]).toBeUndefined()
  })
})

describe('movement', () => {
  it('moves by the dice value', () => {
    let s = newGame(twoSeats())
    s = rollDice(s, 4)
    // 1 + ... wait: 0 + 4 lands on 4 which is a LADDER (4→14)
    expect(s.pos[0]).toBe(14)
    expect(s.events.some((e) => e.type === 'ladder')).toBe(true)
    expect(s.turn).toBe(1)
  })

  it('slides down on a snake head', () => {
    let s = newGame(twoSeats())
    s.pos[0] = 13
    s = rollDice(s, 3) // lands 16 → snake to 6
    expect(s.pos[0]).toBe(6)
    expect(s.events.some((e) => e.type === 'snake' && 'to' in e && e.to === 6)).toBe(true)
  })

  it('requires an exact roll to reach 100', () => {
    let s = newGame(twoSeats())
    s.pos[0] = 97
    s = rollDice(s, 5) // overshoot → stays, turn passes
    expect(s.pos[0]).toBe(97)
    expect(s.turn).toBe(1)
    expect(s.events.some((e) => e.type === 'overshoot')).toBe(true)
  })

  it('wins on an exact landing on 100', () => {
    let s = newGame(twoSeats())
    s.pos[0] = 97
    s = rollDice(s, 3)
    expect(s.pos[0]).toBe(100)
    expect(s.winner).toBe(0)
    expect(s.phase).toBe('over')
  })
})

describe('simulated games', () => {
  it('always terminates with a winner on cell 100', () => {
    for (const seed of [1, 2, 3]) {
      let s = newGame(twoSeats())
      let rng = seed
      const rand = () => (rng = (rng * 1103515245 + 12345) % 2147483648) / 2147483648
      let steps = 0
      while (s.winner === null && steps < 10000) {
        s = rollDice(s, 1 + Math.floor(rand() * 6))
        steps++
      }
      expect(s.winner).not.toBeNull()
      expect(s.pos[s.winner!]).toBe(100)
    }
  })
})
