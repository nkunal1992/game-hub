import { describe, expect, it } from 'vitest'
import {
  COMPUTER_MARK,
  DEFAULT_MARK_O,
  DEFAULT_MARK_X,
  FUN_MARKS,
  markDef,
  MARKS,
  SHAPE_MARKS,
} from './marks'

describe('mark catalog', () => {
  it('has unique ids', () => {
    const ids = MARKS.map((m) => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('shape marks define stroke paths', () => {
    for (const m of SHAPE_MARKS) {
      expect(m.kind).toBe('shape')
      expect(m.paths?.length).toBeGreaterThan(0)
      for (const p of m.paths!) expect(p).toMatch(/^M/)
    }
  })

  it('emoji marks define a glyph', () => {
    for (const m of FUN_MARKS) {
      expect(m.kind).toBe('emoji')
      expect(m.emoji).toBeTruthy()
    }
  })

  it('default marks exist for both seats', () => {
    expect(markDef(DEFAULT_MARK_X).id).toBe('cross')
    expect(markDef(DEFAULT_MARK_O).id).toBe('circle')
    expect(markDef(COMPUTER_MARK).emoji).toBe('🤖')
  })

  it('markDef falls back to cross for unknown ids', () => {
    expect(markDef('nonexistent').id).toBe('cross')
  })
})
