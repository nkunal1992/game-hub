import { describe, expect, it } from 'vitest'
import {
  applyMove,
  availableMoves,
  checkWinner,
  emptyBoard,
  findWinningMove,
  isBoardFull,
  isDraw,
  LINES,
  opponent,
  type Board,
  type Player,
} from './logic'

const boardWith = (entries: Array<[number, Player]>): Board => {
  const board = emptyBoard()
  for (const [i, p] of entries) board[i] = p
  return board
}

describe('checkWinner', () => {
  it.each(LINES.map((line, i) => [i, line] as const))(
    'detects X win on line %i',
    (_i, line) => {
      const board = boardWith(line.map((cell) => [cell, 'X'] as [number, Player]))
      const result = checkWinner(board)
      expect(result?.winner).toBe('X')
      expect(result?.line).toEqual(line)
    },
  )

  it('detects O win', () => {
    const board = boardWith([
      [0, 'O'],
      [4, 'O'],
      [8, 'O'],
    ])
    expect(checkWinner(board)?.winner).toBe('O')
  })

  it('returns null with no winner', () => {
    const board = boardWith([
      [0, 'X'],
      [1, 'O'],
      [2, 'X'],
    ])
    expect(checkWinner(board)).toBeNull()
  })

  it('does not confuse a partial line with a win', () => {
    const board = boardWith([
      [0, 'X'],
      [1, 'X'],
      [2, 'O'],
    ])
    expect(checkWinner(board)).toBeNull()
  })
})

describe('isDraw / isBoardFull', () => {
  it('detects a full-board draw', () => {
    // X O X / X O O / O X X — classic draw
    const board = boardWith([
      [0, 'X'], [1, 'O'], [2, 'X'],
      [3, 'X'], [4, 'O'], [5, 'O'],
      [6, 'O'], [7, 'X'], [8, 'X'],
    ])
    expect(isBoardFull(board)).toBe(true)
    expect(isDraw(board)).toBe(true)
  })

  it('a full board with a winner is not a draw', () => {
    const board = boardWith([
      [0, 'X'], [1, 'X'], [2, 'X'],
      [3, 'O'], [4, 'O'], [5, 'X'],
      [6, 'X'], [7, 'O'], [8, 'O'],
    ])
    expect(isBoardFull(board)).toBe(true)
    expect(isDraw(board)).toBe(false)
  })

  it('an unfinished board is not a draw', () => {
    expect(isDraw(emptyBoard())).toBe(false)
  })
})

describe('availableMoves / applyMove', () => {
  it('lists all cells on an empty board', () => {
    expect(availableMoves(emptyBoard())).toHaveLength(9)
  })

  it('excludes occupied cells', () => {
    const board = boardWith([[0, 'X'], [4, 'O'], [8, 'X']])
    expect(availableMoves(board)).toEqual([1, 2, 3, 5, 6, 7])
  })

  it('returns a new board without mutating the original', () => {
    const board = emptyBoard()
    const next = applyMove(board, 4, 'X')
    expect(next[4]).toBe('X')
    expect(board[4]).toBeNull()
    expect(next).not.toBe(board)
  })

  it('throws when the cell is occupied', () => {
    const board = boardWith([[4, 'X']])
    expect(() => applyMove(board, 4, 'O')).toThrow()
  })
})

describe('findWinningMove', () => {
  it('finds the completing cell', () => {
    const board = boardWith([[3, 'O'], [4, 'O']])
    expect(findWinningMove(board, 'O')).toBe(5)
  })

  it('returns null without two-in-a-row', () => {
    // Cells 1 and 3 share no line, so nothing can be completed.
    const board = boardWith([[1, 'O'], [3, 'O']])
    expect(findWinningMove(board, 'O')).toBeNull()
  })

  it('ignores a blocked line', () => {
    const board = boardWith([[3, 'O'], [4, 'O'], [5, 'X']])
    expect(findWinningMove(board, 'O')).not.toBe(5)
  })
})

describe('opponent', () => {
  it('flips the player', () => {
    expect(opponent('X')).toBe('O')
    expect(opponent('O')).toBe('X')
  })
})
