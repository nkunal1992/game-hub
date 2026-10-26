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
import { play } from '../game/sound'
import type { HistoryEntry, RoundOutcome, Scores, SessionConfig } from '../types'
import GameBoard from './Board'
import Confetti from './Confetti'
import SidePanel from './SidePanel'

type RoundResult =
  | { type: 'win'; winner: Player; line: readonly number[] }
  | { type: 'draw' }

interface GameScreenProps {
  config: SessionConfig
  scores: Scores
  round: number
  history: HistoryEntry[]
  starter: Player
  matchWinner: Player | null
  onOutcome: (outcome: RoundOutcome) => void
  onNextRound: () => void
  onRematch: () => void
  onNewSession: () => void
}

export default function GameScreen({
  config,
  scores,
  round,
  history,
  starter,
  matchWinner,
  onOutcome,
  onNextRound,
  onRematch,
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
    play(mover === 'X' ? 'place-x' : 'place-o')
    const win = checkWinner(next)
    if (win) setResult({ type: 'win', winner: win.winner, line: win.line })
    else if (isDraw(next)) setResult({ type: 'draw' })
    else setTurn(opponent(mover))
  }

  // Report the outcome + fanfare exactly once per round.
  useEffect(() => {
    if (result && !reported.current) {
      reported.current = true
      onOutcome(result.type === 'draw' ? 'draw' : result.winner)
      play(result.type === 'draw' ? 'draw' : 'win')
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

  const roundWinner = result?.type === 'win' ? playerOf(result.winner) : null
  const matchWinnerInfo = matchWinner ? playerOf(matchWinner) : null
  const status = result
    ? result.type === 'win'
      ? `${roundWinner!.name} takes the round`
      : "It's a draw"
    : computerTurn
      ? `${playerOf(turn).name} is thinking`
      : `${playerOf(turn).name} to move`

  return (
    <div className="arena">
      <section className="board-col">
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

          {result?.type === 'win' && (
            <Confetti winner={result.winner} big={!!matchWinner} />
          )}

          {result && matchWinnerInfo && (
            <div className="result-overlay">
              <div className="result-card result-card--match">
                <span className="result-trophy" aria-hidden="true">🏆</span>
                <p className="result-kicker">Match over</p>
                <h2 className="result-title">
                  <span className={`tint-${matchWinner!.toLowerCase()}`}>
                    {matchWinnerInfo.avatar} {matchWinnerInfo.name}
                  </span>{' '}
                  wins the match!
                </h2>
                <p className="result-scoreline">
                  {scores.X} – {scores.O}
                  {scores.draws > 0 ? ` · ${scores.draws} draw${scores.draws === 1 ? '' : 's'}` : ''}
                </p>
                <div className="result-actions">
                  <button type="button" className="btn btn-primary" onClick={onRematch}>
                    Rematch
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={onNewSession}>
                    New session
                  </button>
                </div>
              </div>
            </div>
          )}

          {result && !matchWinner && (
            <div className="result-overlay">
              <div className="result-card">
                <p className="result-kicker">Round {round}</p>
                <h2 className="result-title">
                  {roundWinner ? (
                    <>
                      <span className={`tint-${result.type === 'win' ? result.winner.toLowerCase() : ''}`}>
                        {roundWinner.avatar} {roundWinner.name}
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
      </section>

      <SidePanel
        config={config}
        scores={scores}
        turn={turn}
        roundOver={!!result}
        history={history}
      />
    </div>
  )
}
