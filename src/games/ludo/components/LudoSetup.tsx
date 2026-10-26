import { useState } from 'react'
import AvatarPicker from '../../../shared/AvatarPicker'
import { AVATARS, COMPUTER_AVATAR } from '../../../shared/avatars'
import { seatColors, type LudoColor } from '../game/board'
import type { Difficulty, RulesVariant } from '../game/engine'
import type { LudoSession, SeatConfig } from '../types'

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
  difficulty: Difficulty
}

function defaultSeats(): DraftSeat[] {
  return Array.from({ length: 4 }, (_, i) => ({
    isComputer: false,
    name: `Player ${i + 1}`,
    avatar: AVATARS[i % AVATARS.length],
    difficulty: 'smart' as Difficulty,
  }))
}

interface LudoSetupProps {
  initial: LudoSession | null
  onStart: (session: LudoSession) => void
}

export default function LudoSetup({ initial, onStart }: LudoSetupProps) {
  const [count, setCount] = useState(initial?.seats.length ?? 2)
  const [rules, setRules] = useState<RulesVariant>(initial?.rules ?? 'classic')
  const [seats, setSeats] = useState<DraftSeat[]>(() =>
    initial
      ? [
          ...initial.seats.map((s) => ({
            isComputer: s.isComputer,
            name: s.name,
            avatar: s.avatar,
            difficulty: s.difficulty,
          })),
          ...defaultSeats().slice(initial.seats.length),
        ]
      : defaultSeats(),
  )

  const colors = seatColors(count)
  const update = (i: number, patch: Partial<DraftSeat>) =>
    setSeats((list) => list.map((s, j) => (j === i ? { ...s, ...patch } : s)))

  const start = () => {
    const finalSeats: SeatConfig[] = seats.slice(0, count).map((s, i) => ({
      color: colors[i],
      name: s.isComputer ? `CPU ${COLOR_LABEL[colors[i]]}` : s.name.trim() || `Player ${i + 1}`,
      avatar: s.isComputer ? COMPUTER_AVATAR : s.avatar,
      isComputer: s.isComputer,
      difficulty: s.difficulty,
    }))
    onStart({ seats: finalSeats, rules })
  }

  return (
    <div className="screen setup-screen">
      <div className="card setup-card setup-card--wide">
        <h1 className="setup-title">
          <span aria-hidden="true">🎲</span> Ludo
        </h1>
        <p className="setup-sub">Race all four tokens home — captures send rivals back to base!</p>

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
        </div>

        <div className="field">
          <span className="field-label">Rules</span>
          <div className="segmented" role="radiogroup" aria-label="Rules variant">
            <button
              type="button"
              role="radio"
              aria-checked={rules === 'classic'}
              className={`segment${rules === 'classic' ? ' segment--active' : ''}`}
              onClick={() => setRules('classic')}
            >
              Classic
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={rules === 'kids'}
              className={`segment${rules === 'kids' ? ' segment--active' : ''}`}
              onClick={() => setRules('kids')}
            >
              Kids 😄
            </button>
          </div>
          <p className="field-hint">
            {rules === 'classic'
              ? 'Roll 6 to leave base · exact roll to finish · three 6s forfeit the turn'
              : 'Any roll leaves base · big rolls still finish · no three-6s forfeit'}
          </p>
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
                <div className="field">
                  <span className="field-label">Difficulty</span>
                  <div className="segmented" role="radiogroup" aria-label={`CPU ${i + 1} difficulty`}>
                    {(['easy', 'smart'] as Difficulty[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        role="radio"
                        aria-checked={seats[i].difficulty === d}
                        className={`segment${seats[i].difficulty === d ? ' segment--active' : ''}`}
                        onClick={() => update(i, { difficulty: d })}
                      >
                        {d === 'easy' ? 'Easy 🎈' : 'Smart 🧠'}
                      </button>
                    ))}
                  </div>
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
