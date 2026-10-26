import type { LudoColor } from '../ludo/game/board'

export interface SeatConfig {
  color: LudoColor
  name: string
  avatar: string
  isComputer: boolean
}

export interface SnakesSession {
  seats: SeatConfig[]
}
