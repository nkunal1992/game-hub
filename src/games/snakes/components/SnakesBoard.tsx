import { useMemo } from 'react'
import type { LudoColor } from '../../ludo/game/board'
import { CELLS, LADDERS, SNAKES, cellCenter } from '../game/board'

const SNAKE_COLORS = ['#22b573', '#8e5bff', '#ff6b4a', '#00b8a9', '#e94f9c']
const LADDER_COLORS = ['#38e1ff', '#ff5d8f', '#ffc53d', '#2fd07e', '#b388ff']

const OFFSETS: [number, number][] = [
  [0, 0],
  [-0.18, -0.18],
  [0.18, 0.18],
  [-0.18, 0.18],
  [0.18, -0.18],
]

/** Wavy body path from the snake's head cell to its tail cell. */
function snakePath(head: number, tail: number): string {
  const [hx, hy] = cellCenter(head)
  const [tx, ty] = cellCenter(tail)
  const dx = tx - hx
  const dy = ty - hy
  const len = Math.hypot(dx, dy) || 1
  const px = (-dy / len) * 0.42
  const py = (dx / len) * 0.42
  const c1x = hx + dx * 0.25 + px
  const c1y = hy + dy * 0.25 + py
  const c2x = hx + dx * 0.55 - px
  const c2y = hy + dy * 0.55 - py
  const c3x = hx + dx * 0.8 + px * 0.5
  const c3y = hy + dy * 0.8 + py * 0.5
  return `M ${hx} ${hy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${c3x} ${c3y}, ${tx} ${ty}`
}

/** Two rails + rungs for a ladder from `from` to `to`. */
function ladderParts(from: number, to: number) {
  const [fx, fy] = cellCenter(from)
  const [tx, ty] = cellCenter(to)
  const dx = tx - fx
  const dy = ty - fy
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const px = -uy * 0.15
  const py = ux * 0.15
  const rails: [number, number, number, number][] = [
    [fx + px, fy + py, tx + px, ty + py],
    [fx - px, fy - py, tx - px, ty - py],
  ]
  const rungs: [number, number, number, number][] = []
  for (let d = 0.5; d < len - 0.3; d += 0.58) {
    rungs.push([fx + ux * d + px, fy + uy * d + py, fx + ux * d - px, fy + uy * d - py])
  }
  return { rails, rungs }
}

function FinishStar({ x, y }: { x: number; y: number }) {
  return (
    <path
      className="sb-finish-star"
      d={`M ${x} ${y - 0.18} L ${x + 0.05} ${y - 0.05} L ${x + 0.18} ${y}
          L ${x + 0.05} ${y + 0.05} L ${x} ${y + 0.18} L ${x - 0.05} ${y + 0.05}
          L ${x - 0.18} ${y} L ${x - 0.05} ${y - 0.05} Z`}
    />
  )
}

export interface BoardToken {
  id: number
  seat: number
  color: LudoColor
  cell: number
}

interface SnakesBoardProps {
  seats: { color: LudoColor }[]
  /** visible cell per seat (0 = start, animates independently of engine) */
  vis: number[]
  /** seat currently gliding along a snake/ladder */
  sliding: number | null
}

export default function SnakesBoard({ seats, vis, sliding }: SnakesBoardProps) {
  const tokens = useMemo(() => {
    const list: BoardToken[] = vis.map((cell, seat) => ({
      id: seat,
      seat,
      color: seats[seat].color,
      cell,
    }))
    const seen = new Map<number, number>()
    return list.map((t) => {
      const n = seen.get(t.cell) ?? 0
      seen.set(t.cell, n + 1)
      return { ...t, stack: n }
    })
  }, [seats, vis])

  return (
    <svg viewBox="0 0 10 10" className="ludo-board snakes-board" role="img" aria-label="Snakes and ladders board">
      {/* Tiled cells */}
      {Array.from({ length: CELLS }, (_, i) => {
        const n = i + 1
        const [x, y] = cellCenter(n)
        return (
          <g key={n}>
            <rect
              x={x - 0.47} y={y - 0.47} width={0.94} height={0.94} rx={0.16}
              className={`sb-cell${(i + Math.floor(i / 10)) % 2 === 0 ? ' sb-cell--alt' : ''}`}
            />
            <text x={x - 0.4} y={y - 0.3} className="sb-num" aria-hidden="true">
              {n}
            </text>
            {n === CELLS && <FinishStar x={x + 0.24} y={y + 0.26} />}
          </g>
        )
      })}

      {/* Candy ladders */}
      {Object.entries(LADDERS).map(([from, to], i) => {
        const { rails, rungs } = ladderParts(+from, +to)
        const color = LADDER_COLORS[i % LADDER_COLORS.length]
        return (
          <g key={from} className="sb-ladder" style={{ color }}>
            {rails.map((r, j) => (
              <line key={j} x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} className="sb-rail" />
            ))}
            {rungs.map((r, j) => (
              <line key={j} x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} className="sb-rung" />
            ))}
          </g>
        )
      })}

      {/* Snakes — thick body + belly highlight + head with eyes & tongue */}
      {Object.entries(SNAKES).map(([head, tail], i) => {
        const [hx, hy] = cellCenter(+head)
        const [tx, ty] = cellCenter(+tail)
        const color = SNAKE_COLORS[i % SNAKE_COLORS.length]
        const d = snakePath(+head, +tail)
        return (
          <g key={head} className="sb-snake">
            <path d={d} className="sb-snake-body" style={{ stroke: color }} />
            <path d={d} className="sb-snake-belly" />
            <circle cx={tx} cy={ty} r={0.11} className="sb-snake-tail" style={{ fill: color }} />
            <circle cx={hx} cy={hy} r={0.34} className="sb-snake-head" style={{ fill: color }} />
            <circle cx={hx - 0.11} cy={hy - 0.09} r={0.075} className="sb-snake-eye" />
            <circle cx={hx + 0.11} cy={hy - 0.09} r={0.075} className="sb-snake-eye" />
            <circle cx={hx - 0.11} cy={hy - 0.08} r={0.035} className="sb-snake-pupil" />
            <circle cx={hx + 0.11} cy={hy - 0.08} r={0.035} className="sb-snake-pupil" />
            <path
              d={`M ${hx} ${hy + 0.16} L ${hx - 0.05} ${hy + 0.28} M ${hx} ${hy + 0.16} L ${hx + 0.05} ${hy + 0.28}`}
              className="sb-snake-tongue"
            />
          </g>
        )
      })}

      {/* Tokens */}
      {tokens.map((t) => {
        const [x, y] = cellCenter(Math.max(1, t.cell))
        const [ox, oy] = OFFSETS[Math.min(t.stack, OFFSETS.length - 1)]
        return (
          <g
            key={t.id}
            className={`lb-token lb-token--${t.color}${sliding === t.seat ? ' sb-token--sliding' : ''}`}
            style={{
              transform: `translate(${x + ox}px, ${y + oy + (t.cell === 0 ? 0.32 : 0)}px)`,
              transitionDuration: sliding === t.seat ? '0.8s' : '0.16s',
            }}
          >
            <circle r={0.32} className="lb-token-body" />
            <circle r={0.12} cy={-0.05} className="lb-token-face" />
          </g>
        )
      })}
    </svg>
  )
}
