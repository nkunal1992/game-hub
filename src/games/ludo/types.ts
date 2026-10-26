import type { LudoColor } from './game/board'
import type { Difficulty, RulesVariant } from './game/engine'

export interface SeatConfig {
  color: LudoColor
  name: string
  avatar: string
  isComputer: boolean
  difficulty: Difficulty
}

export interface LudoSession {
  seats: SeatConfig[]
  rules: RulesVariant
}
