import type { Player } from '../game/logic'
import { winsNeeded } from '../game/match'
import type { HistoryEntry, PlayerInfo, Scores, SessionConfig } from '../types'
import MarkGlyph from './MarkGlyph'

interface PlayerCardProps {
  player: PlayerInfo
  score: number
  active: boolean
  needed: number | null
}

function PlayerCard({ player, score, active, needed }: PlayerCardProps) {
  const sym = player.symbol.toLowerCase()
  return (
    <div className={`player-card player-card--${sym}${active ? ' player-card--active' : ''}`}>
      <span className={`avatar avatar--${sym}`} aria-hidden="true">
        {player.avatar}
      </span>
      <div className="player-meta">
        <span className="player-name" title={player.name}>
          {player.name}
          {player.isComputer ? <span className="player-badge">CPU</span> : null}
        </span>
        <span className="player-symbol">
          plays{' '}
          <span className={`mini-mark mini-mark--${sym}`}>
            <MarkGlyph mark={player.mark} seat={player.symbol} mini />
          </span>
        </span>
      </div>
      <span key={score} className="player-score">
        {score}
      </span>
      {needed !== null && (
        <span className="win-pips" aria-label={`${score} of ${needed} wins`}>
          {Array.from({ length: needed }, (_, i) => (
            <i key={i} className={i < score ? 'pip pip--filled' : 'pip'} />
          ))}
        </span>
      )}
      <span className="turn-dot" aria-hidden="true" />
    </div>
  )
}

interface SidePanelProps {
  config: SessionConfig
  scores: Scores
  turn: Player
  roundOver: boolean
  history: HistoryEntry[]
}

export default function SidePanel({ config, scores, turn, roundOver, history }: SidePanelProps) {
  const needed = winsNeeded(config.matchFormat)
  const playerOf = (symbol: Player) => config.players.find((p) => p.symbol === symbol)
  const recent = history.slice(-8).reverse()

  return (
    <aside className="side-panel" aria-label="Scoreboard">
      <PlayerCard
        player={config.players[0]}
        score={scores.X}
        active={!roundOver && turn === 'X'}
        needed={needed}
      />
      <div className="draws-row">
        <span key={scores.draws} className="draws-num">
          {scores.draws}
        </span>
        <span className="draws-label">draws</span>
      </div>
      <PlayerCard
        player={config.players[1]}
        score={scores.O}
        active={!roundOver && turn === 'O'}
        needed={needed}
      />

      {needed !== null && (
        <p className="match-hint">
          First to <b>{needed}</b> takes the match
        </p>
      )}

      {recent.length > 0 && (
        <div className="history">
          <span className="history-label">Rounds</span>
          <ul>
            {recent.map((h) => {
              const winner = h.outcome === 'draw' ? null : playerOf(h.outcome)
              return (
                <li key={h.round} className="history-item">
                  <span className="history-round">R{h.round}</span>
                  {winner ? (
                    <>
                      <span className={`history-dot history-dot--${winner.symbol.toLowerCase()}`} />
                      <span className="history-name">
                        {winner.avatar} {winner.name}
                      </span>
                    </>
                  ) : (
                    <span className="history-name history-name--draw">Draw</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </aside>
  )
}
