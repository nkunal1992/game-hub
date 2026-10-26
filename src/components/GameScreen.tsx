import { useEffect, useRef, useState } from 'react'
import { chooseMove } from '../game/ai'
import {
  applyMove,
  checkWinner,
  emptyBoard,
  isDraw,
  opponent,
  type Board,
  type Player,
} from '../game/logic'
import type { RoundOutcome, Scores, SessionConfig } from '../types'
import GameBoard from './Board'
import Scoreboard from './Scoreboard'

type RoundResult =
  | { type: 'win'; winner: Player; line: readonly number[] }
  | { type: 'draw' }

interface GameScreenProps {
  config: SessionConfig
  scores: Scores
  round: number
  starter: Player
  onOutcome: (outcome: RoundOutcome) => void
  onNextRound: () => void
  onNewSession: () => void
}

export default function GameScreen({
  config,
  scores,
  round,
  starter,
  onOutcome,
  onNextRound,
  onNewSession,
}: GameScreenProps) {
  const [board, setBoard] = useState<Board>(emptyBoard)
  const [turn, setTurn] = useState<Player>(starter)
  const [result, setResult] = useState<RoundResult | null>(null)
  const reported = useRef(false)

  const playerOf = (symbol: Player) =>
    config.players.find((p) => p.symbol === symbol) ?? config.players[0]
  const computer = config.players.find((p) => p.isComputer)
  const computerTurn = !result && !!computer && computer.symbol === turn

  const place = (index: number, mover: Player, from: Board) => {
    const next = applyMove(from, index, mover)
    setBoard(next)
    const win = checkWinner(next)
    if (win) setResult({ type: 'win', winner: win.winner, line: win.line })
    else if (isDraw(next)) setResult({ type: 'draw' })
    else setTurn(opponent(mover))
  }

  // Report the outcome to the session exactly once per round.
  useEffect(() => {
    if (result && !reported.current) {
      reported.current = true
      onOutcome(result.type === 'draw' ? 'draw' : result.winner)
    }
  }, [result, onOutcome])

  // Let the computer take its turn after a short, human-feeling pause.
  useEffect(() => {
    if (!computerTurn || !computer) return
    const timer = setTimeout(
      () => place(chooseMove(board, turn, config.difficulty), turn, board),
      480 + Math.random() * 320,
    )
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computerTurn, board, turn, config.difficulty])

  const handleCellClick = (index: number) => {
    if (result || computerTurn || board[index] !== null) return
    place(index, turn, board)
  }

  const winnerName = result?.type === 'win' ? playerOf(result.winner).name : null
  const status = result
    ? result.type === 'win'
      ? `${winnerName} takes the round`
      : "It's a draw"
    : computerTurn
      ? `${playerOf(turn).name} is thinking`
      : `${playerOf(turn).name} to move`

  return (
    <div className="screen game-screen">
      <div className="game-topbar">
        <span className="round-pill">Round {round}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onNewSession}>
          New session
        </button>
      </div>

      <Scoreboard players={config.players} scores={scores} turn={turn} roundOver={!!result} />

      <p className={`status${computerTurn ? ' status--thinking' : ''}`} aria-live="polite">
        {status}
        {computerTurn && (
          <span className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </p>

      <div className="board-wrap">
        <GameBoard
          board={board}
          turn={turn}
          winLine={result?.type === 'win' ? result.line : null}
          winner={result?.type === 'win' ? result.winner : null}
          interactive={!result && !computerTurn}
          onCellClick={handleCellClick}
        />
        {result && (
          <div className="result-overlay">
            <div className="result-card">
              <p className="result-kicker">Round {round}</p>
              <h2 className="result-title">
                {winnerName ? (
                  <>
                    <span className={`tint-${result.type === 'win' ? result.winner.toLowerCase() : ''}`}>
                      {winnerName}
                    </span>{' '}
                    wins
                  </>
                ) : (
                  "It's a draw"
                )}
              </h2>
              <div className="result-actions">
                <button type="button" className="btn btn-primary" onClick={onNextRound}>
                  Next round
                </button>
                <button type="button" className="btn btn-ghost" onClick={onNewSession}>
                  New session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
