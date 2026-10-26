import { useCallback, useState } from 'react'
import GameScreen from './components/GameScreen'
import SetupScreen from './components/SetupScreen'
import TopBar from './components/TopBar'
import type { Player } from './game/logic'
import { seriesWinner } from './game/match'
import { isMuted, setMuted } from './game/sound'
import { useTheme } from './theme'
import type { HistoryEntry, RoundOutcome, Scores, SessionConfig } from './types'

const ZERO_SCORES: Scores = { X: 0, O: 0, draws: 0 }

function App() {
  const [session, setSession] = useState<SessionConfig | null>(null)
  const [lastConfig, setLastConfig] = useState<SessionConfig | null>(null)
  const [scores, setScores] = useState<Scores>(ZERO_SCORES)
  const [round, setRound] = useState(1)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [runId, setRunId] = useState(0)
  const [muted, setMutedState] = useState(isMuted())
  const { theme, toggle: toggleTheme } = useTheme()

  const handleStart = (config: SessionConfig) => {
    setSession(config)
    setLastConfig(config)
    setScores(ZERO_SCORES)
    setHistory([])
    setRound(1)
    setRunId((id) => id + 1)
  }

  const handleRematch = () => {
    setScores(ZERO_SCORES)
    setHistory([])
    setRound(1)
    setRunId((id) => id + 1)
  }

  const handleOutcome = useCallback((outcome: RoundOutcome) => {
    setScores((s) =>
      outcome === 'draw' ? { ...s, draws: s.draws + 1 } : { ...s, [outcome]: s[outcome] + 1 },
    )
    setHistory((h) => [...h, { round: h.length + 1, outcome }])
  }, [])

  const handleToggleMute = () => {
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }

  const starter: Player = round % 2 === 1 ? 'X' : 'O'
  const matchWinner = session ? seriesWinner(scores, session.matchFormat) : null

  return (
    <div className="app-shell">
      <TopBar
        theme={theme}
        muted={muted}
        round={session ? round : undefined}
        onToggleTheme={toggleTheme}
        onToggleMute={handleToggleMute}
        onNewSession={session ? () => setSession(null) : undefined}
      />
      {session ? (
        <GameScreen
          key={`${runId}-${round}`}
          config={session}
          scores={scores}
          round={round}
          history={history}
          starter={starter}
          matchWinner={matchWinner}
          onOutcome={handleOutcome}
          onNextRound={() => setRound((r) => r + 1)}
          onRematch={handleRematch}
          onNewSession={() => setSession(null)}
        />
      ) : (
        <SetupScreen initial={lastConfig} onStart={handleStart} />
      )}
    </div>
  )
}

export default App
