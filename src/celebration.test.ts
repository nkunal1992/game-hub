import { describe, expect, it } from 'vitest'
import { nextBurst, pickRainEmojis } from './celebration'

describe('pickRainEmojis', () => {
  it('returns the requested count for normal and big celebrations', () => {
    expect(pickRainEmojis(null, false)).toHaveLength(26)
    expect(pickRainEmojis(null, true)).toHaveLength(40)
  })

  it('includes the winner emoji when provided', () => {
    const items = pickRainEmojis('🐸', false)
    expect(items.filter((i) => i.emoji === '🐸').length).toBeGreaterThan(0)
  })

  it('adds trophy emojis for match wins only', () => {
    const normal = new Set(pickRainEmojis(null, false).map((i) => i.emoji))
    const big = new Set(pickRainEmojis(null, true).map((i) => i.emoji))
    expect(normal.has('🏆')).toBe(false)
    expect(big.has('🏆')).toBe(true)
  })

  it('produces sane geometry (0-100% left, negative delays for mid-air start)', () => {
    for (const item of pickRainEmojis('🦄', true)) {
      expect(item.left).toBeGreaterThanOrEqual(0)
      expect(item.left).toBeLessThanOrEqual(100)
      expect(item.dur).toBeGreaterThan(0)
      expect(item.delay).toBeLessThanOrEqual(0)
      expect(item.emoji.length).toBeGreaterThan(0)
    }
  })
})

describe('nextBurst', () => {
  it('alternates launch sides', () => {
    const left = nextBurst(0)
    const right = nextBurst(1)
    expect(left.x).toBeLessThan(50)
    expect(right.x).toBeGreaterThan(50)
  })

  it('keeps ids for react keys', () => {
    expect(nextBurst(7).id).toBe(7)
  })
})
