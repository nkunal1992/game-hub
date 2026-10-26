import { useCallback, useState } from 'react'
import SnakesGameScreen from './components/SnakesGameScreen'
import SnakesSetup from './components/SnakesSetup'
import type { SnakesSession } from './types'

export default function SnakesGame() {
  const [session, setSession] = useState<SnakesSession | null>(null)
  const [lastSession, setLastSession] = useState<SnakesSession | null>(null)
  const [wins, setWins] = useState<number[]>([])
  const [game, setGame] = useState(1)
  const [runId, setRunId] = useState(0)

  const handleStart = (s: SnakesSession) => {
    setSession(s)
    setLastSession(s)
    setWins(Array(s.seats.length).fill(0))
    setGame(1)
    setRunId((id) => id + 1)
  }

  const handleWin = useCallback((seat: number) => {
    setWins((w) => w.map((n, i) => (i === seat ? n + 1 : n)))
  }, [])

  const nextGame = () => {
    setGame((g) => g + 1)
    setRunId((id) => id + 1)
  }

  return session ? (
    <SnakesGameScreen
      key={runId}
      session={session}
      wins={wins}
      game={game}
      onWin={handleWin}
      onRematch={nextGame}
      onNewSession={() => setSession(null)}
    />
  ) : (
    <SnakesSetup initial={lastSession} onStart={handleStart} />
  )
}
