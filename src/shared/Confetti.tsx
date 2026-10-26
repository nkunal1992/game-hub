import { useMemo, type CSSProperties } from 'react'

export type ConfettiTint = 'x' | 'o' | 'draw' | 'red' | 'green' | 'yellow' | 'blue'

interface ConfettiProps {
  tint: ConfettiTint
  /** Bigger burst for match wins. */
  big?: boolean
}

interface Piece {
  tx: number
  ty: number
  rot: number
  size: number
  delay: number
  dur: number
  color: string
  round: boolean
}

const PALETTES: Record<ConfettiTint, string[]> = {
  x: ['var(--x)', 'var(--accent)', '#ffffff', 'var(--x)'],
  o: ['var(--o)', 'var(--accent)', '#ffffff', 'var(--o)'],
  draw: ['var(--muted)', 'var(--accent)', '#ffffff'],
  red: ['var(--ludo-red)', 'var(--accent)', '#ffffff', 'var(--ludo-red)'],
  green: ['var(--ludo-green)', 'var(--accent)', '#ffffff', 'var(--ludo-green)'],
  yellow: ['var(--ludo-yellow)', 'var(--accent)', '#ffffff', 'var(--ludo-yellow)'],
  blue: ['var(--ludo-blue)', 'var(--accent)', '#ffffff', 'var(--ludo-blue)'],
}

function buildPieces(count: number, palette: string[]): Piece[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2
    const dist = 70 + Math.random() * (count > 48 ? 230 : 160)
    return {
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist * 0.8 - 30,
      rot: Math.random() * 720 - 360,
      size: 5 + Math.random() * 8,
      delay: Math.random() * 0.15,
      dur: 0.85 + Math.random() * 0.75,
      color: palette[i % palette.length],
      round: i % 4 === 0,
    }
  })
}

export default function Confetti({ tint, big = false }: ConfettiProps) {
  const pieces = useMemo<Piece[]>(
    () => buildPieces(big ? 90 : 48, PALETTES[tint] ?? PALETTES.draw),
    [tint, big],
  )

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            '--rot': `${p.rot}deg`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.6,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}
