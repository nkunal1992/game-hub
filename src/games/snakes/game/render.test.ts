import { describe, expect, it } from 'vitest'
import { cellCenter } from './board'
import { ladderParts, snakeCurve, snakeFace, splitCubic, taperSegments } from './render'

const near = (a: number, b: number) => Math.abs(a - b) < 1e-9

describe('taperSegments', () => {
  it('produces 3 segments with strictly decreasing widths', () => {
    const segs = taperSegments(98, 78)
    expect(segs).toHaveLength(3)
    expect(segs[0].width).toBeGreaterThan(segs[1].width)
    expect(segs[1].width).toBeGreaterThan(segs[2].width)
  })

  it('first segment starts at the head center, last ends at the tail center', () => {
    const segs = taperSegments(98, 78)
    const [hx, hy] = cellCenter(98)
    const [tx, ty] = cellCenter(78)
    expect(segs[0].d.startsWith(`M ${hx} ${hy}`)).toBe(true)
    expect(segs[2].d.endsWith(`${tx} ${ty}`)).toBe(true)
  })
})

describe('splitCubic', () => {
  it('preserves endpoints at t=0.5', () => {
    const c = snakeCurve(95, 75)
    const [l, r] = splitCubic(c, 0.5)
    expect(near(l[0][0], c[0][0]) && near(l[0][1], c[0][1])).toBe(true)
    expect(near(r[3][0], c[3][0]) && near(r[3][1], c[3][1])).toBe(true)
    expect(near(l[3][0], r[0][0]) && near(l[3][1], r[0][1])).toBe(true)
  })
})

describe('snakeFace', () => {
  it('offsets eyes from the head center and extends the tongue along the tangent', () => {
    const f = snakeFace(98, 78)
    const [hx, hy] = cellCenter(98)
    for (const [ex, ey] of f.eyes) {
      expect(Math.hypot(ex - hx, ey - hy)).toBeGreaterThan(0.05)
      expect(Math.hypot(ex - hx, ey - hy)).toBeLessThan(0.4)
    }
    for (const [tx, ty] of f.tongueTips) {
      expect(Math.hypot(tx - hx, ty - hy)).toBeGreaterThan(
        Math.hypot(f.tongueBase[0] - hx, f.tongueBase[1] - hy),
      )
    }
  })
})

describe('ladderParts', () => {
  it('draws symmetric rails around the center line', () => {
    const { rails } = ladderParts(4, 14)
    const [fx, fy] = cellCenter(4)
    const mid0x = (rails[0][0] + rails[1][0]) / 2
    const mid0y = (rails[0][1] + rails[1][1]) / 2
    expect(near(mid0x, fx) && near(mid0y, fy)).toBe(true)
  })
})
