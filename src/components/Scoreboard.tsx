import type { PlayerInfo, Scores } from '../types'

interface PlayerCardProps {
  player: PlayerInfo
  score: number
  active: boolean
}

function PlayerCard({ player, score, active }: PlayerCardProps) {
  const sym = player.symbol.toLowerCase()
  return (
    <div className={`player-card player-card--${sym}${active ? ' player-card--active' : ''}`}>
      <span className={`chip chip-${sym}`} aria-hidden="true">
        {player.symbol}
      </span>
      <div className="player-meta">
        <span className="player-name" title={player.name}>
          {player.name}
          {player.isComputer ? <span className="player-badge">CPU</span> : null}
        </span>
        <span key={score} className="player-score">
          {score}
        </span>
      </div>
      <span className="turn-dot" aria-hidden="true" />
    </div>
  )
}

interface ScoreboardProps {
  players: [PlayerInfo, PlayerInfo]
  scores: Scores
  turn: 'X' | 'O'
  roundOver: boolean
}

export default function Scoreboard({ players, scores, turn, roundOver }: ScoreboardProps) {
  return (
    <section className="scoreboard" aria-label="Scoreboard">
      <PlayerCard player={players[0]} score={scores.X} active={!roundOver && turn === 'X'} />
      <div className="draws-cell">
        <span key={scores.draws} className="draws-num">
          {scores.draws}
        </span>
        <span className="draws-label">draws</span>
      </div>
      <PlayerCard player={players[1]} score={scores.O} active={!roundOver && turn === 'O'} />
    </section>
  )
}
