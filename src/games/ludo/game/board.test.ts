import { describe, expect, it } from 'vitest'
import {
  COLOR_ORDER,
  HOME_COLUMN,
  SAFE,
  START,
  TRACK,
  globalCell,
  seatColors,
  tokenCell,
} from './board'

describe('board geometry', () => {
  it('has a 52-cell track with unique cells', () => {
    expect(TRACK).toHaveLength(52)
    expect(new Set(TRACK.map(([r, c]) => `${r},${c}`)).size).toBe(52)
  })

  it('spaces the four starts 13 cells apart', () => {
    expect(START.red).toBe(0)
    expect(START.green).toBe(13)
    expect(START.yellow).toBe(26)
    expect(START.blue).toBe(39)
  })

  it('leads each color from its last track cell into its home column', () => {
    // progress 50 → the track cell just before the home-column gate
    for (const color of COLOR_ORDER) {
      const [r, c] = tokenCell(color, 50, 0)
      const [hr, hc] = HOME_COLUMN[color][0]
      // gate cell must be orthogonally adjacent to the first home cell
      expect(Math.abs(r - hr) + Math.abs(c - hc)).toBe(1)
    }
  })

  it('keeps all home-column cells off the main track', () => {
    const trackSet = new Set(TRACK.map(([r, c]) => `${r},${c}`))
    for (const color of COLOR_ORDER) {
      for (const [r, c] of HOME_COLUMN[color]) {
        expect(trackSet.has(`${r},${c}`)).toBe(false)
      }
    }
  })

  it('marks every start square as safe', () => {
    for (const color of COLOR_ORDER) expect(SAFE.has(START[color])).toBe(true)
    expect(SAFE.size).toBe(8)
  })

  it('picks opposite colors for 2-seat games', () => {
    expect(seatColors(2)).toEqual(['red', 'yellow'])
    expect(seatColors(4)).toEqual(['red', 'green', 'yellow', 'blue'])
  })

  it('maps token progress to the right coordinate space', () => {
    expect(tokenCell('red', 0, 0)).toEqual(TRACK[0])
    expect(tokenCell('green', 0, 0)).toEqual(TRACK[13])
    expect(tokenCell('red', 51, 0)).toEqual(HOME_COLUMN.red[0])
    expect(globalCell('yellow', 50)).toBe((START.yellow + 50) % 52)
    expect(globalCell('red', -1)).toBeNull()
    expect(globalCell('red', 56)).toBeNull()
  })
})
