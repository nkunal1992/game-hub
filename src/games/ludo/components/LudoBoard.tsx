import { useMemo } from 'react'
import {
  BASE_RECTS,
  BASE_SPOTS,
  COLOR_ORDER,
  HOME_COLUMN,
  START,
  TRACK,
  tokenCell,
  type LudoColor,
} from '../game/board'

const SAFE_STARS = new Set([8, 21, 34, 47])

/** Tiny 4-point star used to mark safe cells. */
function Star({ x, y, className }: { x: number; y: number; className: string }) {
  return (
    <path
      className={className}
      d={`M ${x} ${y - 0.22} L ${x + 0.07} ${y - 0.07} L ${x + 0.22} ${y}
          L ${x + 0.07} ${y + 0.07} L ${x} ${y + 0.22} L ${x - 0.07} ${y + 0.07}
          L ${x - 0.22} ${y} L ${x - 0.07} ${y - 0.07} Z`}
    />
  )
}

export interface BoardToken {
  /** Stable id = seat * 4 + tokenIndex */
  id: number
  seat: number
  token: number
  color: LudoColor
  row: number
  col: number
}

interface LudoBoardProps {
  seats: { color: LudoColor }[]
  /** tokens[seat][idx] progress — same shape as GameState.tokens */
  tokens: number[][]
  /** token ids the current player may move */
  movable: number[]
  onTokenClick?: (seat: number, token: number) => void
}

/** Cluster offset so stacked tokens don't perfectly overlap. */
const OFFSETS: [number, number][] = [
  [0, 0],
  [-0.16, -0.16],
  [0.16, 0.16],
  [-0.16, 0.16],
  [0.16, -0.16],
]

export default function LudoBoard({ seats, tokens, movable, onTokenClick }: LudoBoardProps) {
  const boardTokens = useMemo(() => {
    const list: BoardToken[] = []
    tokens.forEach((row, seat) =>
      row.forEach((p, token) => {
        const [r, c] = tokenCell(seats[seat].color, p, token)
        list.push({ id: seat * 4 + token, seat, token, color: seats[seat].color, row: r, col: c })
      }),
    )
    // Count siblings sharing a cell for stack offsets.
    const seen = new Map<string, number>()
    return list.map((t) => {
      const key = `${t.row},${t.col}`
      const n = seen.get(key) ?? 0
      seen.set(key, n + 1)
      return { ...t, stack: n }
    })
  }, [seats, tokens])

  const startColorAt = new Map<number, LudoColor>(
    COLOR_ORDER.map((c) => [START[c], c]),
  )

  return (
    <svg viewBox="0 0 15 15" className="ludo-board" role="img" aria-label="Ludo board">
      {/* Base quadrants */}
      {COLOR_ORDER.map((color) => {
        const [r, c] = BASE_RECTS[color]
        return (
          <g key={color}>
            <rect x={c} y={r} width={6} height={6} rx={0.7} className={`lb-base lb-base--${color}`} />
            <rect x={c + 0.7} y={r + 0.7} width={4.6} height={4.6} rx={0.5} className="lb-base-pad" />
            {BASE_SPOTS[color].map(([sr, sc], i) => (
              <circle key={i} cx={sc + 0.5} cy={sr + 0.5} r={0.42} className={`lb-spot lb-spot--${color}`} />
            ))}
          </g>
        )
      })}

      {/* Main track cells */}
      {TRACK.map(([r, c], i) => {
        const startColor = startColorAt.get(i)
        return (
          <g key={i}>
            <rect
              x={c} y={r} width={1} height={1}
              className={`lb-cell${startColor ? ` lb-cell--start-${startColor}` : ''}`}
            />
            {SAFE_STARS.has(i) && <Star x={c + 0.5} y={r + 0.5} className="lb-star" />}
          </g>
        )
      })}

      {/* Home columns */}
      {COLOR_ORDER.map((color) =>
        HOME_COLUMN[color].map(([r, c], i) => (
          <rect
            key={`${color}-${i}`}
            x={c} y={r} width={1} height={1}
            className={`lb-cell lb-cell--home-${color}`}
          />
        )),
      )}

      {/* Center — one triangle per color, base on its home-column side */}
      <path d="M 6 6 L 6 9 L 7.5 7.5 Z" className="lb-center lb-center--red" />
      <path d="M 6 6 L 9 6 L 7.5 7.5 Z" className="lb-center lb-center--green" />
      <path d="M 9 6 L 9 9 L 7.5 7.5 Z" className="lb-center lb-center--yellow" />
      <path d="M 6 9 L 9 9 L 7.5 7.5 Z" className="lb-center lb-center--blue" />

      {/* Tokens */}
      {boardTokens.map((t) => {
        const [ox, oy] = OFFSETS[Math.min(t.stack, OFFSETS.length - 1)]
        const canMove = movable.includes(t.id)
        return (
          <g
            key={t.id}
            className={`lb-token lb-token--${t.color}${canMove ? ' lb-token--movable' : ''}`}
            style={{ transform: `translate(${t.col + 0.5 + ox}px, ${t.row + 0.5 + oy}px)` }}
            onClick={canMove ? () => onTokenClick?.(t.seat, t.token) : undefined}
            role={canMove ? 'button' : undefined}
            aria-label={canMove ? `Move token ${t.token + 1}` : undefined}
          >
            <circle r={0.36} className="lb-token-body" />
            <circle r={0.14} cy={-0.06} className="lb-token-face" />
          </g>
        )
      })}
    </svg>
  )
}
