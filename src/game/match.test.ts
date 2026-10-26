import { describe, expect, it } from 'vitest'
import { seriesWinner, winsNeeded } from './match'
import type { Scores } from '../types'

const scores = (X: number, O: number, draws = 0): Scores => ({ X, O, draws })

describe('winsNeeded', () => {
  it('maps formats to the clinch threshold', () => {
    expect(winsNeeded('bo3')).toBe(2)
    expect(winsNeeded('bo5')).toBe(3)
    expect(winsNeeded('free')).toBeNull()
  })
})

describe('seriesWinner', () => {
  it('returns null while the match is open', () => {
    expect(seriesWinner(scores(0, 0), 'bo3')).toBeNull()
    expect(seriesWinner(scores(1, 1), 'bo3')).toBeNull()
    expect(seriesWinner(scores(2, 2), 'bo5')).toBeNull()
  })

  it('detects a Bo3 clinch', () => {
    expect(seriesWinner(scores(2, 0), 'bo3')).toBe('X')
    expect(seriesWinner(scores(1, 2), 'bo3')).toBe('O')
  })

  it('detects a Bo5 clinch', () => {
    expect(seriesWinner(scores(3, 1), 'bo5')).toBe('X')
    expect(seriesWinner(scores(0, 3), 'bo5')).toBe('O')
  })

  it('never clinches in free play', () => {
    expect(seriesWinner(scores(99, 0), 'free')).toBeNull()
  })

  it('ignores draws when checking the clinch', () => {
    expect(seriesWinner(scores(1, 1, 5), 'bo3')).toBeNull()
    expect(seriesWinner(scores(2, 1, 5), 'bo3')).toBe('X')
  })
})
