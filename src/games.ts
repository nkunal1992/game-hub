export type GameId = 'tictactoe' | 'ludo' | 'snakes'

export const GAMES: { id: GameId; label: string; icon: string }[] = [
  { id: 'tictactoe', label: 'Tic Tac Toe', icon: '❌' },
  { id: 'ludo', label: 'Ludo', icon: '🎲' },
  { id: 'snakes', label: 'Snakes', icon: '🐍' },
]
