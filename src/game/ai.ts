import {
  applyMove,
  availableMoves,
  checkWinner,
  findWinningMove,
  opponent,
  type Board,
  type Player,
} from './logic'

export type Difficulty = 'easy' | 'medium' | 'hard'

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)]

function minimax(
  board: Board,
  turn: Player,
  ai: Player,
  depth: number,
): number {
  const result = checkWinner(board)
  if (result) {
    return result.winner === ai ? 10 - depth : depth - 10
  }
  const moves = availableMoves(board)
  if (moves.length === 0) return 0

  const scores = moves.map((move) =>
    minimax(applyMove(board, move, turn), opponent(turn), ai, depth + 1),
  )
  return turn === ai ? Math.max(...scores) : Math.min(...scores)
}

export function bestMove(board: Board, ai: Player): number {
  const moves = availableMoves(board)
  let best = -Infinity
  let candidates: number[] = []
  for (const move of moves) {
    const score = minimax(applyMove(board, move, ai), opponent(ai), ai, 1)
    if (score > best) {
      best = score
      candidates = [move]
    } else if (score === best) {
      candidates.push(move)
    }
  }
  return pick(candidates)
}

/** Win if possible, otherwise block, otherwise center/corner/side preference. */
function heuristicMove(board: Board, ai: Player): number {
  const win = findWinningMove(board, ai)
  if (win !== null) return win
  const block = findWinningMove(board, opponent(ai))
  if (block !== null) return block
  if (board[4] === null) return 4
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null)
  if (corners.length > 0) return pick(corners)
  return pick(availableMoves(board))
}

export function chooseMove(board: Board, ai: Player, difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return pick(availableMoves(board))
    case 'medium':
      return heuristicMove(board, ai)
    case 'hard':
      return bestMove(board, ai)
  }
}
