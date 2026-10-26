import { describe, expect, it } from 'vitest'
import { chooseToken } from './ai'
import { BASE, applyMove, legalMoves, newGame, rollDice, type Seat } from './engine'

const cpu = (color: Seat['color'], difficulty: Seat['difficulty']): Seat => ({
  color,
  name: color,
  avatar: '🤖',
  isComputer: true,
  difficulty,
})

const seats = (d: Seat['difficulty'] = 'smart'): Seat[] => [
  cpu('red', d),
  cpu('yellow', 'easy'),
]

function stateAfterRoll(
  tokens: number[][],
  dice: number,
  difficulty: Seat['difficulty'] = 'smart',
) {
  const s = { ...newGame(seats(difficulty), 'classic'), tokens }
  return rollDice(s, dice)
}

describe('chooseToken', () => {
  it('returns null when there are no legal moves', () => {
    const s = stateAfterRoll([[BASE, BASE, BASE, BASE], [BASE, BASE, BASE, BASE]], 3)
    expect(chooseToken(s)).toBeNull()
  })

  it('easy picks among legal moves only', () => {
    const s = stateAfterRoll([[BASE, 10, BASE, BASE], [BASE, BASE, BASE, BASE]], 6, 'easy')
    for (let i = 0; i < 20; i++) {
      expect(legalMoves(s)).toContain(chooseToken(s, () => 0.99))
    }
  })

  it('smart prefers the capturing move', () => {
    // red token0 at 10, token1 at 3; yellow sits on cell 5 (red progress 5).
    // (26+p)%52 = 5 → p = 31 → put yellow token at 31
    const s = stateAfterRoll(
      [[10, 3, BASE, BASE], [31, BASE, BASE, BASE]],
      2, // token1: 3→5 captures; token0: 10→12
    )
    expect(chooseToken(s, () => 0.5)).toBe(1)
    const { state } = applyMove(s, 1)
    expect(state.tokens[1][0]).toBe(BASE)
  })

  it('smart prefers finishing a token', () => {
    const s = stateAfterRoll(
      [[55, 10, BASE, BASE], [BASE, BASE, BASE, BASE]],
      1, // token0: 55→56 finish vs token1: 10→11
    )
    expect(chooseToken(s, () => 0.5)).toBe(0)
  })

  it('never produces an illegal move across many random states', () => {
    let s = newGame([cpu('red', 'smart'), cpu('yellow', 'smart')], 'kids')
    let rngState = 99
    const rng = () => (rngState = (rngState * 1103515245 + 12345) % 2147483648) / 2147483648
    let steps = 0
    while (s.winner === null && steps < 3000) {
      if (s.phase === 'roll') s = rollDice(s, 1 + Math.floor(rng() * 6))
      else {
        const t = chooseToken(s, rng)
        expect(t).not.toBeNull()
        s = applyMove(s, t!).state
      }
      steps++
    }
    expect(s.winner).not.toBeNull()
  })
})
