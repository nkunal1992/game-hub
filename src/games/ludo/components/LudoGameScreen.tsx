import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Celebration from '../../../shared/Celebration'
import { chooseToken } from '../game/ai'
import {
  applyMove,
  legalMoves,
  newGame,
  rollDice,
  seatSummary,
  type GameState,
} from '../game/engine'
import type { LudoSession } from '../types'
import Dice from './Dice'
import LudoBoard from './LudoBoard'

const ROLL_ANIM_MS = 620
const CPU_THINK_MS = 750

interface LudoGameScreenProps {
  session: LudoSession
  wins: number[]
  game: number
  onWin: (seat: number) => void
  onRematch: () => void
  onNewSession: () => void
}

export default function LudoGameScreen({
  session,
  wins,
  game,
  onWin,
  onRematch,
  onNewSession,
}: LudoGameScreenProps) {
  const [state, setState] = useState<GameState>(() =>
    newGame(
      session.seats.map((s) => ({ ...s })),
      session.rules,
    ),
  )
  const [rolling, setRolling] = useState(false)
  const [lastDice, setLastDice] = useState<number | null>(null)
  const reported = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const after = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms))
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const seat = state.seats[state.turn]
  const movable = useMemo(() => legalMoves(state), [state])
  const movableIds = useMemo(
    () => movable.map((t) => state.turn * 4 + t),
    [movable, state.turn],
  )
  const over = state.winner !== null
  const isCpuTurn = !over && seat.isComputer

  const doRoll = useCallback(() => {
    setRolling(true)
    const value = 1 + Math.floor(Math.random() * 6)
    after(ROLL_ANIM_MS, () => {
      setRolling(false)
      setLastDice(value)
      setState((s) => rollDice(s, value))
    })
  }, [])

  const doMove = useCallback((token: number) => {
    setState((s) => applyMove(s, token).state)
  }, [])

  // CPU plays its own turns with a human-feeling pause.
  useEffect(() => {
    if (!isCpuTurn) return
    if (state.phase === 'roll') after(CPU_THINK_MS, doRoll)
    else if (state.phase === 'move') after(CPU_THINK_MS, () => doMove(chooseToken(state)!))
  }, [isCpuTurn, state, doRoll, doMove])

  // Exactly one legal move means there's no decision — play it for humans too.
  useEffect(() => {
    if (!over && !isCpuTurn && state.phase === 'move' && movable.length === 1) {
      after(500, () => doMove(movable[0]))
    }
  }, [over, isCpuTurn, state.phase, movable, doMove])

  // Report the win to the session scoreboard exactly once.
  useEffect(() => {
    if (over && !reported.current) {
      reported.current = true
      onWin(state.winner!)
    }
  }, [over, state.winner, onWin])

  const lastRoll = state.events.findLast((e) => e.type === 'roll')
  const status = over
    ? `${state.seats[state.winner!].name} wins the game!`
    : rolling
      ? `${seat.name} is rolling…`
      : state.phase === 'roll'
        ? isCpuTurn
          ? `${seat.name} is thinking…`
          : `${seat.name} — roll the dice`
        : lastRoll && 'value' in lastRoll
          ? `${seat.name} rolled ${lastRoll.value} — tap a glowing token`
          : `${seat.name} — tap a glowing token`

  const winnerSeat = over ? state.seats[state.winner!] : null

  return (
    <div className="arena ludo-arena">
      <section className="board-col">
        <p className="status" aria-live="polite">
          <span className={`rules-pill rules-pill--${session.rules}`}>
            {session.rules === 'classic' ? 'Classic' : 'Kids 😄'}
          </span>
          {status}
          {isCpuTurn && (
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
        </p>

        <div className="board-wrap board-wrap--ludo">
          <LudoBoard
            seats={state.seats}
            tokens={state.tokens}
            movable={state.phase === 'move' && !isCpuTurn ? movableIds : []}
            onTokenClick={(_, token) => doMove(token)}
          />

          <div className="dice-dock">
            <Dice
              value={lastDice}
              rolling={rolling}
              disabled={over || isCpuTurn || state.phase !== 'roll'}
              onRoll={doRoll}
              label={
                isCpuTurn
                  ? `${seat.name} is rolling`
                  : state.phase === 'roll'
                    ? 'Roll the dice'
                    : 'Pick a token to move'
              }
            />
            {lastRoll && 'value' in lastRoll && (
              <span key={`${state.turn}-${lastRoll.value}`} className="dice-callout">
                {lastRoll.value}
              </span>
            )}
          </div>

          {over && winnerSeat && (
            <Celebration tint={winnerSeat.color} winEmoji={winnerSeat.avatar} big />
          )}

          {over && (
            <div className="result-overlay">
              <div className="result-card result-card--match">
                <span className="result-trophy" aria-hidden="true">🏆</span>
                <p className="result-kicker">Game {game} over</p>
                <h2 className="result-title">
                  <span className={`tint-${winnerSeat!.color}`}>
                    {winnerSeat!.avatar} {winnerSeat!.name}
                  </span>{' '}
                  wins!
                </h2>
                <div className="result-actions">
                  <button type="button" className="btn btn-primary" onClick={onRematch}>
                    Play again
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

      <aside className="side-panel" aria-label="Players">
        {state.seats.map((s, i) => {
          const sum = seatSummary(state, i)
          return (
            <div
              key={s.color}
              className={`player-card player-card--ludo player-card--${s.color}${
                !over && state.turn === i ? ' player-card--active' : ''
              }`}
            >
              <span className={`avatar avatar--ludo avatar--${s.color}`} aria-hidden="true">
                {s.avatar}
              </span>
              <div className="player-meta">
                <span className="player-name" title={s.name}>
                  {s.name}
                  {s.isComputer ? <span className="player-badge">CPU</span> : null}
                </span>
                <span className="player-symbol ludo-progress">
                  <i className="tok tok--base" /> {sum.base}
                  <i className="tok tok--track" /> {sum.track}
                  <i className="tok tok--home" /> {sum.home}
                </span>
              </div>
              <span key={wins[i]} className="player-score">
                {wins[i]}
              </span>
              <span className="turn-dot" aria-hidden="true" />
            </div>
          )
        })}

        <p className="match-hint">
          Game {game} · {session.rules === 'classic' ? 'Classic rules' : 'Kids rules'}
        </p>

        <button type="button" className="btn btn-ghost btn-sm panel-new" onClick={onNewSession}>
          New session
        </button>
      </aside>
    </div>
  )
}
