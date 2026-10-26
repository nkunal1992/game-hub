import type { Difficulty } from './game/ai'
import type { Player } from './game/logic'

export type GameMode = 'local' | 'ai'

export interface PlayerInfo {
  name: string
  symbol: Player
  isComputer: boolean
}

export interface SessionConfig {
  mode: GameMode
  difficulty: Difficulty
  players: [PlayerInfo, PlayerInfo]
}

export interface Scores {
  X: number
  O: number
  draws: number
}

export type RoundOutcome = 'X' | 'O' | 'draw'
