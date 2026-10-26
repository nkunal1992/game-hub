import { useCallback, useState } from 'react'
import GameScreen from './components/GameScreen'
import SetupScreen from './components/SetupScreen'
import type { Player } from './game/logic'
import type { RoundOutcome, Scores, SessionConfig } from './types'

const ZERO_SCORES: Scores = { X: 0, O: 0, draws: 0 }

function App() {
  const [session, setSession] = useState<SessionConfig | null>(null)
  const [scores, setScores] = useState<Scores>(ZERO_SCORES)
  const [round, setRound] = useState(1)

  const handleStart = (config: SessionConfig) => {
    setSession(config)
    setScores(ZERO_SCORES)
    setRound(1)
  }

  const handleOutcome = useCallback((outcome: RoundOutcome) => {
    setScores((s) =>
      outcome === 'draw' ? { ...s, draws: s.draws + 1 } : { ...s, [outcome]: s[outcome] + 1 },
    )
  }, [])

  const starter: Player = round % 2 === 1 ? 'X' : 'O'

  return (
    <div className="app-shell">
      {session ? (
        <GameScreen
          key={round}
          config={session}
          scores={scores}
          round={round}
          starter={starter}
          onOutcome={handleOutcome}
          onNextRound={() => setRound((r) => r + 1)}
          onNewSession={() => setSession(null)}
        />
      ) : (
        <SetupScreen initial={session} onStart={handleStart} />
      )}
    </div>
  )
}

export default App
