import { useState } from 'react'
import type { Difficulty } from '../game/ai'
import { MATCH_FORMATS, type MatchFormat } from '../game/match'
import { AVATARS, COMPUTER_AVATAR } from '../avatars'
import { COMPUTER_MARK, DEFAULT_MARK_O, DEFAULT_MARK_X, MARKS } from '../marks'
import type { GameMode, SessionConfig } from '../types'
import AvatarPicker from './AvatarPicker'
import MarkGlyph from './MarkGlyph'
import MarkPicker from './MarkPicker'

interface SetupScreenProps {
  initial: SessionConfig | null
  onStart: (config: SessionConfig) => void
}

const DIFFICULTIES: Array<{ value: Difficulty; label: string; blurb: string }> = [
  { value: 'easy', label: 'Easy', blurb: 'Plays at random — good for warming up.' },
  { value: 'medium', label: 'Medium', blurb: 'Takes wins and blocks yours — but can be outplayed.' },
  { value: 'hard', label: 'Hard', blurb: 'Perfect play. Best you can hope for is a draw.' },
]

export default function SetupScreen({ initial, onStart }: SetupScreenProps) {
  const [mode, setMode] = useState<GameMode>(initial?.mode ?? 'local')
  const [nameX, setNameX] = useState(
    initial && !initial.players[0].isComputer ? initial.players[0].name : '',
  )
  const [nameO, setNameO] = useState(
    initial && !initial.players[1].isComputer ? initial.players[1].name : '',
  )
  const [avatarX, setAvatarX] = useState(initial?.players[0].avatar ?? AVATARS[0])
  const [avatarO, setAvatarO] = useState(
    initial && !initial.players[1].isComputer ? initial.players[1].avatar : AVATARS[1],
  )
  const [markX, setMarkX] = useState(initial?.players[0].mark ?? DEFAULT_MARK_X)
  const [markO, setMarkO] = useState(initial?.players[1].mark ?? DEFAULT_MARK_O)
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initial?.difficulty ?? 'medium',
  )
  const [matchFormat, setMatchFormat] = useState<MatchFormat>(
    initial?.matchFormat ?? 'free',
  )

  const start = () => {
    onStart({
      mode,
      difficulty,
      matchFormat,
      players: [
        {
          name: nameX.trim() || 'Player 1',
          symbol: 'X',
          isComputer: false,
          avatar: avatarX,
          mark: markX,
        },
        {
          name: mode === 'ai' ? 'Computer' : nameO.trim() || 'Player 2',
          symbol: 'O',
          isComputer: mode === 'ai',
          avatar: mode === 'ai' ? COMPUTER_AVATAR : avatarO,
          mark:
            mode === 'ai'
              ? COMPUTER_MARK
              : markO === markX
                ? MARKS.find((m) => m.id !== markX)!.id
                : markO,
        },
      ],
    })
  }

  const blurb = DIFFICULTIES.find((d) => d.value === difficulty)?.blurb

  return (
    <div className="screen setup-screen">
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

        <div className={`name-grid${mode === 'ai' ? ' name-grid--single' : ''}`}>
          <div className="player-setup">
            <label className="field">
              <span className="field-label">
                <i className="chip chip-x">X</i> {mode === 'ai' ? 'You' : 'Player one'}
              </span>
              <input
                value={nameX}
                onChange={(e) => setNameX(e.target.value)}
                placeholder="Player 1"
                maxLength={16}
                autoComplete="off"
              />
            </label>
            <AvatarPicker value={avatarX} onChange={setAvatarX} aria-label="Player 1 avatar" />
            <div className="field">
              <span className="field-label">Piece</span>
              <MarkPicker
                value={markX}
                onChange={setMarkX}
                exclude={mode === 'local' ? markO : COMPUTER_MARK}
                seat="X"
                aria-label="Player 1 piece"
              />
            </div>
          </div>
          {mode === 'local' ? (
            <div className="player-setup">
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
              <AvatarPicker value={avatarO} onChange={setAvatarO} aria-label="Player 2 avatar" />
              <div className="field">
                <span className="field-label">Piece</span>
                <MarkPicker
                  value={markO}
                  onChange={setMarkO}
                  exclude={markX}
                  seat="O"
                  aria-label="Player 2 piece"
                />
              </div>
            </div>
          ) : (
            <div className="player-setup player-setup--cpu">
              <span className="field-label">
                <i className="chip chip-o">O</i> Opponent
              </span>
              <div className="cpu-card">
                <span className="cpu-avatar">{COMPUTER_AVATAR}</span>
                <span className="cpu-name">Computer</span>
                <span className="cpu-mark" title="Robot piece">
                  <MarkGlyph mark={COMPUTER_MARK} seat="O" mini />
                </span>
              </div>
            </div>
          )}
        </div>

        {mode === 'ai' && (
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
        )}

        <div className="field">
          <span className="field-label">Match</span>
          <div className="segmented" role="radiogroup" aria-label="Match format">
            {MATCH_FORMATS.map((f) => (
              <button
                key={f.value}
                type="button"
                role="radio"
                aria-checked={matchFormat === f.value}
                className={`segment${matchFormat === f.value ? ' segment--active' : ''}`}
                onClick={() => setMatchFormat(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="field-hint">
            {MATCH_FORMATS.find((f) => f.value === matchFormat)?.hint}
            {matchFormat !== 'free' ? ' wins' : ' — scores reset only on a new session.'}
          </p>
        </div>

        <button type="button" className="btn btn-primary btn-lg" onClick={start}>
          Start match
        </button>
      </div>

      <p className="footnote">The first move alternates every round.</p>
    </div>
  )
}
