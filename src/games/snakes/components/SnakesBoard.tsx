import { useMemo } from 'react'
import type { LudoColor } from '../../ludo/game/board'
import { CELLS, LADDERS, SNAKES, cellCenter } from '../game/board'
import { ladderParts, snakeFace, taperSegments } from '../game/render'

const SNAKE_COLORS = ['#e0503f', '#3f9e4d', '#7a4fd0', '#e07b39', '#2f9e94', '#c0437f', '#4a6fd8', '#8a9b2e', '#d85c9e', '#5f8a3c']
const LADDER_COLORS = ['#c96f1e', '#2f7fc4', '#c22f6f', '#3f8f3f', '#8f6fd0', '#c4a02f', '#2fa8a0', '#b0503f', '#6a8f3f']

const OFFSETS: [number, number][] = [
  [0, 0],
  [-0.18, -0.18],
  [0.18, 0.18],
  [-0.18, 0.18],
  [0.18, -0.18],
]

function FinishStar({ x, y }: { x: number; y: number }) {
  return (
    <path
      className="sb-finish-star"
      d={`M ${x} ${y - 0.2} L ${x + 0.06} ${y - 0.06} L ${x + 0.2} ${y}
          L ${x + 0.06} ${y + 0.06} L ${x} ${y + 0.2} L ${x - 0.06} ${y + 0.06}
          L ${x - 0.2} ${y} L ${x - 0.06} ${y - 0.06} Z`}
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
    const list = vis.map((cell, seat) => ({ id: seat, seat, color: seats[seat].color, cell }))
    const seen = new Map<number, number>()
    return list.map((t) => {
      const n = seen.get(t.cell) ?? 0
      seen.set(t.cell, n + 1)
      return { ...t, stack: n }
    })
  }, [seats, vis])

  return (
    <svg viewBox="0 0 10 10" className="ludo-board snakes-board" role="img" aria-label="Snakes and ladders board">
      {/* Layer 1 — classic pastel tiles */}
      {Array.from({ length: CELLS }, (_, i) => {
        const n = i + 1
        const [x, y] = cellCenter(n)
        return (
          <rect
            key={n}
            x={x - 0.47} y={y - 0.47} width={0.94} height={0.94} rx={0.14}
            className={`sb-cell sb-row-${Math.floor(i / 10)}`}
          />
        )
      })}

      {/* Layer 2 — ladders */}
      {Object.entries(LADDERS).map(([from, to], i) => {
        const { rails, rungs } = ladderParts(+from, +to)
        return (
          <g key={from} className="sb-ladder" style={{ color: LADDER_COLORS[i % LADDER_COLORS.length] }}>
            {rails.map((r, j) => (
              <line key={j} x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} className="sb-rail" />
            ))}
            {rungs.map((r, j) => (
              <line key={j} x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} className="sb-rung" />
            ))}
          </g>
        )
      })}

      {/* Layer 3 — tapered snakes with oriented faces */}
      {Object.entries(SNAKES).map(([head, tail], i) => {
        const [hx, hy] = cellCenter(+head)
        const [tx, ty] = cellCenter(+tail)
        const color = SNAKE_COLORS[i % SNAKE_COLORS.length]
        const segs = taperSegments(+head, +tail)
        const face = snakeFace(+head, +tail)
        return (
          <g key={head} className="sb-snake">
            {segs.map((s, j) => (
              <path key={j} d={s.d} className="sb-snake-body" style={{ stroke: color, strokeWidth: s.width }} />
            ))}
            <path d={segs[0].d} className="sb-snake-belly" />
            <circle cx={tx} cy={ty} r={0.08} className="sb-snake-tail" style={{ fill: color }} />
            <circle cx={hx} cy={hy} r={0.33} className="sb-snake-head" style={{ fill: color }} />
            {face.eyes.map(([ex, ey], j) => (
              <circle key={`e${j}`} cx={ex} cy={ey} r={0.075} className="sb-snake-eye" />
            ))}
            {face.pupils.map(([px, py], j) => (
              <circle key={`p${j}`} cx={px} cy={py} r={0.035} className="sb-snake-pupil" />
            ))}
            <path
              d={`M ${face.tongueBase[0]} ${face.tongueBase[1]} L ${face.tongueTips[0][0]} ${face.tongueTips[0][1]}
                  M ${face.tongueBase[0]} ${face.tongueBase[1]} L ${face.tongueTips[1][0]} ${face.tongueTips[1][1]}`}
              className="sb-snake-tongue"
            />
          </g>
        )
      })}

      {/* Layer 4 — numbers + finish marker always on top */}
      {Array.from({ length: CELLS }, (_, i) => {
        const n = i + 1
        const [x, y] = cellCenter(n)
        return (
          <g key={n} className="sb-num-layer">
            <text x={x - 0.38} y={y - 0.3} className="sb-num" aria-hidden="true">
              {n}
            </text>
            {n === CELLS && <FinishStar x={x + 0.24} y={y + 0.26} />}
          </g>
        )
      })}

      {/* Layer 5 — tokens */}
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
