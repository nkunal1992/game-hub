import { useCallback, useEffect, useRef, useState } from 'react'
import Celebration from '../../../shared/Celebration'
import Dice from '../../../shared/Dice'
import { newGame, rollDice, type GameState } from '../game/engine'
import type { SnakesSession } from '../types'
import SnakesBoard from './SnakesBoard'

const ROLL_ANIM_MS = 620
const STEP_MS = 140
const SLIDE_MS = 850
const CPU_THINK_MS = 800

interface SnakesGameScreenProps {
  session: SnakesSession
  wins: number[]
  game: number
  onWin: (seat: number) => void
  onRematch: () => void
  onNewSession: () => void
}

export default function SnakesGameScreen({
  session,
  wins,
  game,
  onWin,
  onRematch,
  onNewSession,
}: SnakesGameScreenProps) {
  const [state, setState] = useState<GameState>(() =>
    newGame(session.seats.map((s) => ({ ...s }))),
  )
  const [vis, setVis] = useState<number[]>(state.pos)
  const [sliding, setSliding] = useState<number | null>(null)
  const [rolling, setRolling] = useState(false)
  const [lastDice, setLastDice] = useState<number | null>(null)
  const reported = useRef(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const animTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const after = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms))
  }
  const afterAnim = (ms: number, fn: () => void) => {
    animTimers.current.push(setTimeout(fn, ms))
  }
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      animTimers.current.forEach(clearTimeout)
    },
    [],
  )

  const seat = state.seats[state.turn]
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

  // CPU auto-rolls with a human-feeling pause.
  useEffect(() => {
    if (isCpuTurn) after(CPU_THINK_MS, doRoll)
  }, [isCpuTurn, doRoll])

  // Animate: step through cells, then glide along any snake/ladder.
  useEffect(() => {
    const moveEv = state.events.find((e) => e.type === 'move')
    const slideEv = state.events.find((e) => e.type === 'ladder' || e.type === 'snake')
    if (moveEv && 'from' in moveEv && 'to' in moveEv) {
      const { seat: s, from, to } = moveEv
      const steps = to - from
      afterAnim(0, () => {
        setSliding(null)
        setVis((v) => v.map((p, i) => (i === s ? from : p)))
      })
      for (let i = 1; i <= steps; i++) {
        afterAnim(i * STEP_MS, () => setVis((v) => v.map((p, j) => (j === s ? from + i : p))))
      }
      if (slideEv && 'to' in slideEv) {
        const slideTo = slideEv.to
        afterAnim(steps * STEP_MS + 200, () => {
          setSliding(s)
          setVis((v) => v.map((p, j) => (j === s ? slideTo : p)))
        })
        afterAnim(steps * STEP_MS + 200 + SLIDE_MS + 100, () => setSliding(null))
      }
    } else {
      const pos = state.pos
      afterAnim(0, () => {
        setSliding(null)
        setVis(pos)
      })
    }
    return () => {
      animTimers.current.forEach(clearTimeout)
      animTimers.current = []
    }
  }, [state])

  // Report the win exactly once.
  useEffect(() => {
    if (over && !reported.current) {
      reported.current = true
      onWin(state.winner!)
    }
  }, [over, state.winner, onWin])

  const last = state.events[state.events.length - 1]
  const status = over
    ? `${state.seats[state.winner!].name} reached 100 and wins!`
    : rolling
      ? `${seat.name} is rolling…`
      : last?.type === 'snake' && 'to' in last
        ? `🐍 ${state.seats[last.seat].name} got bitten — down to ${last.to}!`
        : last?.type === 'ladder' && 'to' in last
          ? `🪜 ${state.seats[last.seat].name} climbs up to ${last.to}!`
          : last?.type === 'overshoot' && 'needed' in last
            ? `${state.seats[last.seat].name} needs exactly ${last.needed} — turn passes`
            : isCpuTurn
              ? `${seat.name} is thinking…`
              : `${seat.name} — roll the dice`

  const winnerSeat = over ? state.seats[state.winner!] : null

  return (
    <div className="arena ludo-arena">
      <section className="board-col">
        <p className="status" aria-live="polite">
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
          <SnakesBoard seats={state.seats} vis={vis} sliding={sliding} />

          <div className="dice-dock">
            <Dice
              value={lastDice}
              rolling={rolling}
              disabled={over || isCpuTurn}
              onRoll={doRoll}
              label={isCpuTurn ? `${seat.name} is rolling` : 'Roll the dice'}
            />
            {lastDice !== null && (
              <span key={`${state.turn}-${lastDice}-${state.events.length}`} className="dice-callout">
                {lastDice}
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
                  reached 100!
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
        {state.seats.map((s, i) => (
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
                <i className={`seat-dot seat-dot--${s.color}`} aria-hidden="true" />
                {s.name}
                {s.isComputer ? <span className="player-badge">CPU</span> : null}
              </span>
              <span className="player-symbol">cell {state.pos[i] === 0 ? 'start' : state.pos[i]}</span>
            </div>
            <span key={wins[i]} className="player-score">
              {wins[i]}
            </span>
            <span className="turn-dot" aria-hidden="true" />
          </div>
        ))}

        <p className="match-hint">Game {game} · first to exactly 100</p>

        <button type="button" className="btn btn-ghost btn-sm panel-new" onClick={onNewSession}>
          New session
        </button>
      </aside>
    </div>
  )
}
