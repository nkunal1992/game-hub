import { useCallback, useState } from 'react'
import LudoGameScreen from './components/LudoGameScreen'
import LudoSetup from './components/LudoSetup'
import type { LudoSession } from './types'

export default function LudoGame() {
  const [session, setSession] = useState<LudoSession | null>(null)
  const [lastSession, setLastSession] = useState<LudoSession | null>(null)
  const [wins, setWins] = useState<number[]>([])
  const [game, setGame] = useState(1)
  const [runId, setRunId] = useState(0)

  const handleStart = (s: LudoSession) => {
    setSession(s)
    setLastSession(s)
    setWins(Array(s.seats.length).fill(0))
    setGame(1)
    setRunId((id) => id + 1)
  }

  const handleWin = useCallback(
    (seat: number) => {
      setWins((w) => w.map((n, i) => (i === seat ? n + 1 : n)))
    },
    [],
  )

  const nextGame = () => {
    setGame((g) => g + 1)
    setRunId((id) => id + 1)
  }

  return session ? (
    <LudoGameScreen
      key={runId}
      session={session}
      wins={wins}
      game={game}
      onWin={handleWin}
      onRematch={nextGame}
      onNewSession={() => setSession(null)}
    />
  ) : (
    <LudoSetup initial={lastSession} onStart={handleStart} />
  )
}
