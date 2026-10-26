import { useState } from 'react'
import AvatarPicker from '../../../shared/AvatarPicker'
import { AVATARS, COMPUTER_AVATAR } from '../../../shared/avatars'
import type { LudoColor } from '../../ludo/game/board'
import type { SeatConfig, SnakesSession } from '../types'

/** Seat colors — distinct pairs first (no base adjacency to worry about). */
const SEAT_COLORS: LudoColor[] = ['red', 'blue', 'green', 'yellow']

const COLOR_LABEL: Record<LudoColor, string> = {
  red: 'Red',
  green: 'Green',
  yellow: 'Yellow',
  blue: 'Blue',
}

interface DraftSeat {
  isComputer: boolean
  name: string
  avatar: string
}

function defaultSeats(): DraftSeat[] {
  return Array.from({ length: 4 }, (_, i) => ({
    isComputer: false,
    name: `Player ${i + 1}`,
    avatar: AVATARS[i % AVATARS.length],
  }))
}

interface SnakesSetupProps {
  initial: SnakesSession | null
  onStart: (session: SnakesSession) => void
}

export default function SnakesSetup({ initial, onStart }: SnakesSetupProps) {
  const [count, setCount] = useState(initial?.seats.length ?? 2)
  const [seats, setSeats] = useState<DraftSeat[]>(() =>
    initial
      ? [
          ...initial.seats.map((s) => ({
            isComputer: s.isComputer,
            name: s.name,
            avatar: s.avatar,
          })),
          ...defaultSeats().slice(initial.seats.length),
        ]
      : defaultSeats(),
  )

  const colors = SEAT_COLORS.slice(0, count)
  const update = (i: number, patch: Partial<DraftSeat>) =>
    setSeats((list) => list.map((s, j) => (j === i ? { ...s, ...patch } : s)))

  const start = () => {
    const finalSeats: SeatConfig[] = seats.slice(0, count).map((s, i) => ({
      color: colors[i],
      name: s.isComputer ? `CPU ${COLOR_LABEL[colors[i]]}` : s.name.trim() || `Player ${i + 1}`,
      avatar: s.isComputer ? COMPUTER_AVATAR : s.avatar,
      isComputer: s.isComputer,
    }))
    onStart({ seats: finalSeats })
  }

  return (
    <div className="screen setup-screen">
      <div className="card setup-card setup-card--wide">
        <h1 className="setup-title">
          <span aria-hidden="true">🐍</span> Snakes &amp; Ladders
        </h1>
        <p className="setup-sub">
          First to exactly 100 wins — ladders lift you up, snakes drag you down!
        </p>

        <div className="field">
          <span className="field-label">Players</span>
          <div className="segmented" role="radiogroup" aria-label="Player count">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={count === n}
                className={`segment${count === n ? ' segment--active' : ''}`}
                onClick={() => setCount(n)}
              >
                {n} players
              </button>
            ))}
          </div>
          <p className="field-hint">You need the exact roll to land on 100.</p>
        </div>

        <div className="seat-grid">
          {colors.map((color, i) => (
            <div key={color} className={`player-setup seat-card seat-card--${color}`}>
              <span className="field-label">
                <i className={`chip chip-${color}`}>{i + 1}</i> Seat {i + 1}
              </span>
              <div className="segmented" role="radiogroup" aria-label={`Seat ${i + 1} type`}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={!seats[i].isComputer}
                  className={`segment${!seats[i].isComputer ? ' segment--active' : ''}`}
                  onClick={() =>
                    update(i, {
                      isComputer: false,
                      avatar:
                        seats[i].avatar === COMPUTER_AVATAR
                          ? AVATARS[i % AVATARS.length]
                          : seats[i].avatar,
                    })
                  }
                >
                  🧑 Human
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={seats[i].isComputer}
                  className={`segment${seats[i].isComputer ? ' segment--active' : ''}`}
                  onClick={() => update(i, { isComputer: true })}
                >
                  🤖 CPU
                </button>
              </div>
              {!seats[i].isComputer ? (
                <>
                  <label className="field">
                    <input
                      value={seats[i].name}
                      maxLength={14}
                      onChange={(e) => update(i, { name: e.target.value })}
                      placeholder={`Player ${i + 1}`}
                      autoComplete="off"
                      aria-label={`Player ${i + 1} name`}
                    />
                  </label>
                  <AvatarPicker
                    value={seats[i].avatar}
                    onChange={(avatar) => update(i, { avatar })}
                    aria-label={`Player ${i + 1} avatar`}
                  />
                </>
              ) : (
                <div className="cpu-card">
                  <span className="cpu-avatar">{COMPUTER_AVATAR}</span>
                  <span className="cpu-name">Computer</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button type="button" className="btn btn-primary btn-lg" onClick={start}>
          Start game
        </button>
      </div>
    </div>
  )
}
