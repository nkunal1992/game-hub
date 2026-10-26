import { describe, expect, it } from 'vitest'
import { bestMove, chooseMove } from './ai'
import {
  applyMove,
  availableMoves,
  checkWinner,
  emptyBoard,
  isDraw,
  opponent,
  type Board,
  type Player,
} from './logic'

const boardWith = (entries: Array<[number, Player]>): Board => {
  const board = emptyBoard()
  for (const [i, p] of entries) board[i] = p
  return board
}

describe('chooseMove — easy', () => {
  it('always returns a legal move', () => {
    const board = boardWith([[0, 'X'], [4, 'O'], [8, 'X']])
    for (let i = 0; i < 20; i++) {
      expect(availableMoves(board)).toContain(chooseMove(board, 'O', 'easy'))
    }
  })
})

describe('chooseMove — medium', () => {
  it('takes an immediate win', () => {
    const board = boardWith([[0, 'O'], [1, 'O'], [4, 'X'], [8, 'X']])
    expect(chooseMove(board, 'O', 'medium')).toBe(2)
  })

  it('blocks an immediate loss', () => {
    const board = boardWith([[0, 'X'], [1, 'X'], [4, 'O']])
    expect(chooseMove(board, 'O', 'medium')).toBe(2)
  })

  it('prefers center on an empty-ish board', () => {
    const board = boardWith([[0, 'X']])
    expect(chooseMove(board, 'O', 'medium')).toBe(4)
  })
})

describe('bestMove — hard (minimax)', () => {
  it('takes the immediate win', () => {
    const board = boardWith([[6, 'O'], [7, 'O'], [0, 'X'], [1, 'X']])
    expect(bestMove(board, 'O')).toBe(8)
  })

  it('blocks the fork-free immediate threat', () => {
    const board = boardWith([[0, 'X'], [1, 'X'], [4, 'O']])
    expect(bestMove(board, 'O')).toBe(2)
  })

  it('hard vs hard always draws', () => {
    let board = emptyBoard()
    let turn: Player = 'X'
    while (!checkWinner(board) && !isDraw(board)) {
      board = applyMove(board, bestMove(board, turn), turn)
      turn = opponent(turn)
    }
    expect(isDraw(board)).toBe(true)
  })

  it('never loses against a random opponent (either symbol)', () => {
    for (const aiSymbol of ['X', 'O'] as const) {
      for (let game = 0; game < 30; game++) {
        let board = emptyBoard()
        let turn: Player = 'X'
        while (!checkWinner(board) && !isDraw(board)) {
          const move =
            turn === aiSymbol
              ? bestMove(board, aiSymbol)
              : availableMoves(board)[Math.floor(Math.random() * availableMoves(board).length)]
          board = applyMove(board, move, turn)
          turn = opponent(turn)
        }
        const result = checkWinner(board)
        expect(result === null || result.winner === aiSymbol).toBe(true)
      }
    }
  })
})
