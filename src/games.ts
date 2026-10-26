export type GameId = 'tictactoe' | 'ludo'

export const GAMES: { id: GameId; label: string; icon: string }[] = [
  { id: 'tictactoe', label: 'Tic Tac Toe', icon: '❌' },
  { id: 'ludo', label: 'Ludo', icon: '🎲' },
]
