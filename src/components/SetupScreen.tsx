import { useState } from 'react'
import type { Difficulty } from '../game/ai'
import type { GameMode, SessionConfig } from '../types'

interface SetupScreenProps {
  initial: SessionConfig | null
  onStart: (config: SessionConfig) => void
}

const DIFFICULTIES: Array<{ value: Difficulty; label: string; blurb: string }> = [
  { value: 'easy', label: 'Easy', blurb: 'Plays at random — good for warming up.' },
  { value: 'medium', label: 'Medium', blurb: 'Takes wins and blocks yours — but can be outplayed.' },
  { value: 'hard', label: 'Hard', blurb: 'Perfect play. Best you can hope for is a draw.' },
]

function BrandMark() {
  return (
    <svg viewBox="0 0 48 48" className="brand-mark" aria-hidden="true">
      <rect x="1.5" y="1.5" width="45" height="45" rx="11" className="brand-tile" />
      <path d="M17.5 1.5v45M30.5 1.5v45M1.5 17.5h45M1.5 30.5h45" className="brand-grid" />
      <path d="M6.5 6.5l8 8M14.5 6.5l-8 8" className="brand-x" />
      <circle cx="24" cy="37.5" r="4.6" className="brand-o" />
    </svg>
  )
}

export default function SetupScreen({ initial, onStart }: SetupScreenProps) {
  const [mode, setMode] = useState<GameMode>(initial?.mode ?? 'local')
  const [nameX, setNameX] = useState(
    initial && !initial.players[0].isComputer ? initial.players[0].name : '',
  )
  const [nameO, setNameO] = useState(
    initial && !initial.players[1].isComputer ? initial.players[1].name : '',
  )
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initial?.difficulty ?? 'medium',
  )

  const start = () => {
    onStart({
      mode,
      difficulty,
      players: [
        { name: nameX.trim() || 'Player 1', symbol: 'X', isComputer: false },
        {
          name: mode === 'ai' ? 'Computer' : nameO.trim() || 'Player 2',
          symbol: 'O',
          isComputer: mode === 'ai',
        },
      ],
    })
  }

  const blurb = DIFFICULTIES.find((d) => d.value === difficulty)?.blurb

  return (
    <div className="screen setup-screen">
      <header className="brand">
        <BrandMark />
        <h1 className="wordmark">Tic Tac Toe</h1>
        <p className="tagline">A match, not just a game.</p>
      </header>

      <div className="card setup-card">
        <div className="field">
          <span className="field-label" id="mode-label">
            Mode
          </span>
          <div className="segmented" role="radiogroup" aria-labelledby="mode-label">
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'local'}
              className={`segment${mode === 'local' ? ' segment--active' : ''}`}
              onClick={() => setMode('local')}
            >
              Two players
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'ai'}
              className={`segment${mode === 'ai' ? ' segment--active' : ''}`}
              onClick={() => setMode('ai')}
            >
              vs Computer
            </button>
          </div>
        </div>

        {mode === 'local' ? (
          <div className="name-grid">
            <label className="field">
              <span className="field-label">
                <i className="chip chip-x">X</i> Player one
              </span>
              <input
                value={nameX}
                onChange={(e) => setNameX(e.target.value)}
                placeholder="Player 1"
                maxLength={16}
                autoComplete="off"
              />
            </label>
            <label className="field">
              <span className="field-label">
                <i className="chip chip-o">O</i> Player two
              </span>
              <input
                value={nameO}
                onChange={(e) => setNameO(e.target.value)}
                placeholder="Player 2"
                maxLength={16}
                autoComplete="off"
              />
            </label>
          </div>
        ) : (
          <>
            <label className="field">
              <span className="field-label">
                <i className="chip chip-x">X</i> Your name
              </span>
              <input
                value={nameX}
                onChange={(e) => setNameX(e.target.value)}
                placeholder="Player 1"
                maxLength={16}
                autoComplete="off"
              />
            </label>
            <div className="field">
              <span className="field-label">Difficulty</span>
              <div className="segmented" role="radiogroup" aria-label="Difficulty">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    role="radio"
                    aria-checked={difficulty === d.value}
                    className={`segment${difficulty === d.value ? ' segment--active' : ''}`}
                    onClick={() => setDifficulty(d.value)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="field-hint">{blurb}</p>
            </div>
            <p className="field-hint">
              You play <b className="tint-x">X</b>, the computer plays{' '}
              <b className="tint-o">O</b>. The first move alternates every round.
            </p>
          </>
        )}

        <button type="button" className="btn btn-primary btn-lg" onClick={start}>
          Start match
        </button>
      </div>

      <p className="footnote">Play as many rounds as you like — scores reset only when you start a new session.</p>
    </div>
  )
}
