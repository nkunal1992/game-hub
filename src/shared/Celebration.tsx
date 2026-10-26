import { useEffect, useMemo, useRef, useState } from 'react'
import { nextBurst, pickRainEmojis, type Burst } from './party'
import Confetti, { type ConfettiTint } from './Confetti'

const MAX_LIVE_BURSTS = 6

interface CelebrationProps {
  /** Winner's color — drives confetti palette. */
  tint: ConfettiTint
  /** Optional emoji (mark / avatar) that joins the rain every 4th drop. */
  winEmoji?: string | null
  /** Match win = denser rain, faster cannons, trophies. */
  big?: boolean
}

export default function Celebration({ tint, winEmoji = null, big = false }: CelebrationProps) {
  const rain = useMemo(() => pickRainEmojis(winEmoji, big), [winEmoji, big])
  const [bursts, setBursts] = useState<Burst[]>([])
  const seq = useRef(0)

  useEffect(() => {
    const fire = () => {
      const burst = nextBurst(seq.current++)
      setBursts((list) => [...list.slice(-(MAX_LIVE_BURSTS - 1)), burst])
    }
    fire()
    const interval = setInterval(fire, big ? 430 : 680)
    return () => clearInterval(interval)
  }, [big])

  return (
    <div className="celebration" aria-hidden="true">
      {rain.map((r, i) => (
        <span
          key={i}
          className="rain-emoji"
          style={{
            left: `${r.left}%`,
            animationDuration: `${r.dur}s`,
            animationDelay: `${r.delay}s`,
            fontSize: r.size,
          }}
        >
          {r.emoji}
        </span>
      ))}
      {bursts.map((b) => (
        <div key={b.id} className="cannon" style={{ left: `${b.x}%` }}>
          <Confetti tint={tint} />
        </div>
      ))}
    </div>
  )
}
