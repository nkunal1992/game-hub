/** 10×10 serpentine board + classic snake/ladder layout. */

export const CELLS = 100

/** Classic snake & ladder jumps (start cell → destination cell). */
export const LADDERS: Readonly<Record<number, number>> = {
  1: 38,
  4: 14,
  9: 31,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100,
}

export const SNAKES: Readonly<Record<number, number>> = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
}

export type Cell = readonly [row: number, col: number]

/**
 * Cell number → grid coordinate on a 10×10 board.
 * 1 is bottom-left, numbers snake up row by row to 100 at top-left.
 * row 0 = top of the viewBox.
 */
export function cellCoord(n: number): Cell {
  const rowFromBottom = Math.floor((n - 1) / 10)
  const colInRow = (n - 1) % 10
  const row = 9 - rowFromBottom
  const col = rowFromBottom % 2 === 0 ? colInRow : 9 - colInRow
  return [row, col]
}

/** Center of a cell in viewBox units (10×10 grid, 1 unit per cell). */
export function cellCenter(n: number): [x: number, y: number] {
  const [r, c] = cellCoord(n)
  return [c + 0.5, r + 0.5]
}
