import type { Difficulty } from './game/ai'
import type { Player } from './game/logic'
import type { MatchFormat } from './game/match'

export type GameMode = 'local' | 'ai'

export interface PlayerInfo {
  name: string
  symbol: Player
  isComputer: boolean
  avatar: string
  /** Chosen board piece — id into the mark catalog (src/marks.ts). */
  mark: string
}

export interface SessionConfig {
  mode: GameMode
  difficulty: Difficulty
  matchFormat: MatchFormat
  players: [PlayerInfo, PlayerInfo]
}

export interface Scores {
  X: number
  O: number
  draws: number
}

export type RoundOutcome = 'X' | 'O' | 'draw'

export interface HistoryEntry {
  round: number
  outcome: RoundOutcome
}
