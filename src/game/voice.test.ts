import { describe, expect, it } from 'vitest'
import { pickLine } from './voice'

describe('pickLine', () => {
  it('interpolates the player name', () => {
    const lines = ['Yay, {name} wins!', '{name} did it!']
    for (let i = 0; i < 10; i++) {
      expect(pickLine(lines, 'Ada')).toMatch(/Ada/)
    }
  })

  it('only returns lines from the pool', () => {
    const lines = ['one {name}', 'two {name}']
    for (let i = 0; i < 20; i++) {
      expect(['one Bo', 'two Bo']).toContain(pickLine(lines, 'Bo'))
    }
  })
})
