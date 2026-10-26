export type Player = 'X' | 'O'
export type CellValue = Player | null
export type Board = CellValue[]

export const BOARD_SIZE = 9

export const LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export interface WinResult {
  winner: Player
  line: readonly [number, number, number]
}

export const emptyBoard = (): Board => Array<CellValue>(BOARD_SIZE).fill(null)

export const opponent = (player: Player): Player => (player === 'X' ? 'O' : 'X')

export function checkWinner(board: Board): WinResult | null {
  for (const line of LINES) {
    const [a, b, c] = line
    const v = board[a]
    if (v !== null && v === board[b] && v === board[c]) {
      return { winner: v, line }
    }
  }
  return null
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null)
}

export function isDraw(board: Board): boolean {
  return isBoardFull(board) && checkWinner(board) === null
}

export function availableMoves(board: Board): number[] {
  const moves: number[] = []
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (board[i] === null) moves.push(i)
  }
  return moves
}

/** Index that completes a line for `player`, or null if none exists. */
export function findWinningMove(board: Board, player: Player): number | null {
  for (const line of LINES) {
    const values = line.map((i) => board[i])
    if (values.filter((v) => v === player).length === 2 && values.includes(null)) {
      return line[values.indexOf(null)]
    }
  }
  return null
}

export function applyMove(board: Board, index: number, player: Player): Board {
  if (board[index] !== null) {
    throw new Error(`Cell ${index} is already occupied`)
  }
  const next = board.slice()
  next[index] = player
  return next
}
