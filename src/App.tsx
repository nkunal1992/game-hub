import { useState } from 'react'
import type { GameId } from './games'
import LudoGame from './games/ludo/LudoGame'
import TicTacToe from './games/tictactoe/TicTacToe'
import TopBar from './shared/TopBar'
import { useTheme } from './shared/theme'

function App() {
  const [game, setGame] = useState<GameId>('tictactoe')
  const { theme, toggle: toggleTheme } = useTheme()

  return (
    <div className="app-shell">
      <TopBar theme={theme} active={game} onSwitch={setGame} onToggleTheme={toggleTheme} />
      <div className={`game-pane${game === 'tictactoe' ? '' : ' game-pane--hidden'}`}>
        <TicTacToe />
      </div>
      <div className={`game-pane${game === 'ludo' ? '' : ' game-pane--hidden'}`}>
        <LudoGame />
      </div>
    </div>
  )
}

export default App
