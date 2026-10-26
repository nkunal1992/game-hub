/** Board geometry for a standard 15×15 Ludo board. */

export type LudoColor = 'red' | 'green' | 'yellow' | 'blue'

export const COLOR_ORDER: readonly LudoColor[] = ['red', 'green', 'yellow', 'blue']

/** Grid coordinate on the 15×15 board. */
export type Cell = readonly [row: number, col: number]

/**
 * The 52-cell main track, in clockwise order starting at red's entry cell.
 * Each color's tokens enter at START[color] and lap the board once before
 * turning into their home column.
 */
export const TRACK: readonly Cell[] = [
  // red entry row, left arm (0-4)
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  // up the left side of the top arm (5-10)
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  // across the top (11-12)
  [0, 7], [0, 8],
  // green entry column, right side of top arm (13-17)
  [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  // top of the right arm (18-23)
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  // down the right edge (24-25)
  [7, 14], [8, 14],
  // yellow entry row, right arm (26-30)
  [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  // down the right side of the bottom arm (31-36)
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  // across the bottom (37-38)
  [14, 7], [14, 6],
  // blue entry column, left side of bottom arm (39-43)
  [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  // bottom of the left arm (44-49)
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  // up the left edge back to red entry row (50-51)
  [7, 0], [6, 0],
]

/** Track index where each color enters the board. */
export const START: Record<LudoColor, number> = {
  red: 0,
  green: 13,
  yellow: 26,
  blue: 39,
}

/** Safe (star) squares — no captures here. The 4 start cells + 4 star cells. */
export const SAFE: ReadonlySet<number> = new Set([0, 8, 13, 21, 26, 34, 39, 47])

/** Home column cells (progress 51–55) leading to the center. */
export const HOME_COLUMN: Record<LudoColor, readonly Cell[]> = {
  red: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]],
  green: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  yellow: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9]],
  blue: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
}

/** Token parking spots inside each 6×6 base. */
export const BASE_SPOTS: Record<LudoColor, readonly Cell[]> = {
  red: [[2, 2], [2, 4], [4, 2], [4, 4]],
  green: [[2, 11], [2, 13], [4, 11], [4, 13]],
  yellow: [[11, 11], [11, 13], [13, 11], [13, 13]],
  blue: [[11, 2], [11, 4], [13, 2], [13, 4]],
}

/** Finished tokens rest just inside the center triangle. */
export const FINISH_SPOTS: Record<LudoColor, readonly Cell[]> = {
  red: [[7.1, 6.1], [6.9, 6.4], [7.4, 6.4], [7.1, 6.7]],
  green: [[6.1, 7.1], [6.4, 6.9], [6.4, 7.4], [6.7, 7.1]],
  yellow: [[7.9, 8.9], [8.1, 8.6], [7.6, 8.6], [7.9, 8.3]],
  blue: [[8.9, 7.9], [8.6, 8.1], [8.6, 7.6], [8.3, 7.9]],
}

/** Base quadrant rectangles [row, col, size]. */
export const BASE_RECTS: Record<LudoColor, readonly [row: number, col: number]> = {
  red: [0, 0],
  green: [0, 9],
  yellow: [9, 9],
  blue: [9, 0],
}

/** Which colors play for a given seat count (2-seat games use opposite bases). */
export function seatColors(count: number): LudoColor[] {
  if (count === 2) return ['red', 'yellow']
  if (count === 3) return ['red', 'green', 'yellow']
  return [...COLOR_ORDER]
}

/**
 * Token progress → board coordinate.
 * progress: -1 = in base, 0–50 = main track steps from own start,
 * 51–55 = home column, 56 = finished.
 */
export function tokenCell(color: LudoColor, progress: number, tokenIndex: number): Cell {
  if (progress < 0) return BASE_SPOTS[color][tokenIndex]
  if (progress <= 50) return TRACK[(START[color] + progress) % 52]
  if (progress <= 55) return HOME_COLUMN[color][progress - 51]
  return FINISH_SPOTS[color][tokenIndex]
}

/** Global track cell index for a token on the main track (0–50 progress). */
export function globalCell(color: LudoColor, progress: number): number | null {
  if (progress < 0 || progress > 50) return null
  return (START[color] + progress) % 52
}
