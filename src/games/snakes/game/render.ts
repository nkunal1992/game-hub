/** Pure SVG geometry for the board artwork — testable, no React. */

import { cellCenter } from './board'

export type Pt = readonly [x: number, y: number]
export type Cubic = readonly [p0: Pt, c1: Pt, c2: Pt, p1: Pt]

/** Wavy cubic curve from the snake's head cell to its tail cell. */
export function snakeCurve(head: number, tail: number): Cubic {
  const [hx, hy] = cellCenter(head)
  const [tx, ty] = cellCenter(tail)
  const dx = tx - hx
  const dy = ty - hy
  const len = Math.hypot(dx, dy) || 1
  const px = (-dy / len) * 0.42
  const py = (dx / len) * 0.42
  return [
    [hx, hy],
    [hx + dx * 0.3 + px, hy + dy * 0.3 + py],
    [hx + dx * 0.7 - px, hy + dy * 0.7 - py],
    [tx, ty],
  ] as Cubic
}

/** De Casteljau split of a cubic at parameter t → [left, right] cubics. */
export function splitCubic(c: Cubic, t: number): [Cubic, Cubic] {
  const lerp = (a: Pt, b: Pt): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
  const [p0, c1, c2, p1] = c
  const q0 = lerp(p0, c1)
  const q1 = lerp(c1, c2)
  const q2 = lerp(c2, p1)
  const r0 = lerp(q0, q1)
  const r1 = lerp(q1, q2)
  const s = lerp(r0, r1)
  return [
    [p0, q0, r0, s],
    [s, r1, q2, p1],
  ]
}

const cubicToPath = (c: Cubic) =>
  `M ${c[0][0]} ${c[0][1]} C ${c[1][0]} ${c[1][1]}, ${c[2][0]} ${c[2][1]}, ${c[3][0]} ${c[3][1]}`

export interface TaperSegment {
  d: string
  width: number
}

const TAPER_WIDTHS = [0.3, 0.21, 0.12]

/** Snake body as 3 tapered segments — thick at the head, thin at the tail. */
export function taperSegments(head: number, tail: number): TaperSegment[] {
  const [first, rest] = splitCubic(snakeCurve(head, tail), 1 / 3)
  const [mid, last] = splitCubic(rest, 0.5)
  return [first, mid, last].map((c, i) => ({
    d: cubicToPath(c),
    width: TAPER_WIDTHS[i],
  }))
}

export interface SnakeFace {
  eyes: [Pt, Pt]
  pupils: [Pt, Pt]
  tongueBase: Pt
  tongueTips: [Pt, Pt]
}

/**
 * Eye/pupil/tongue positions oriented along the curve's initial tangent —
 * the face points down the body instead of always facing up.
 */
export function snakeFace(head: number, tail: number): SnakeFace {
  const [p0, c1] = snakeCurve(head, tail)
  const dx = c1[0] - p0[0]
  const dy = c1[1] - p0[1]
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const px = -uy
  const py = ux
  return {
    eyes: [
      [p0[0] + ux * 0.14 + px * 0.11, p0[1] + uy * 0.14 + py * 0.11],
      [p0[0] + ux * 0.14 - px * 0.11, p0[1] + uy * 0.14 - py * 0.11],
    ],
    pupils: [
      [p0[0] + ux * 0.19 + px * 0.11, p0[1] + uy * 0.19 + py * 0.11],
      [p0[0] + ux * 0.19 - px * 0.11, p0[1] + uy * 0.19 - py * 0.11],
    ],
    tongueBase: [p0[0] + ux * 0.3, p0[1] + uy * 0.3],
    tongueTips: [
      [p0[0] + ux * 0.42 + px * 0.07, p0[1] + uy * 0.42 + py * 0.07],
      [p0[0] + ux * 0.42 - px * 0.07, p0[1] + uy * 0.42 - py * 0.07],
    ],
  }
}

/** Two rails + rungs for a ladder from `from` to `to`. */
export function ladderParts(from: number, to: number) {
  const [fx, fy] = cellCenter(from)
  const [tx, ty] = cellCenter(to)
  const dx = tx - fx
  const dy = ty - fy
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const px = -uy * 0.15
  const py = ux * 0.15
  const rails: [number, number, number, number][] = [
    [fx + px, fy + py, tx + px, ty + py],
    [fx - px, fy - py, tx - px, ty - py],
  ]
  const rungs: [number, number, number, number][] = []
  for (let d = 0.5; d < len - 0.3; d += 0.58) {
    rungs.push([fx + ux * d + px, fy + uy * d + py, fx + ux * d - px, fy + uy * d - py])
  }
  return { rails, rungs }
}
