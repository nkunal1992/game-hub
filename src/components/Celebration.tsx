import { useEffect, useMemo, useRef, useState } from 'react'
import type { Player } from '../game/logic'
import { markDef } from '../marks'
import { nextBurst, pickRainEmojis, type Burst } from '../celebration'
import Confetti from './Confetti'

const MAX_LIVE_BURSTS = 6

interface CelebrationProps {
  winner: Player
  /** Winner's mark id — emoji marks join the rain. */
  mark: string
  /** Match win = denser rain, faster cannons, trophies. */
  big?: boolean
}

export default function Celebration({ winner, mark, big = false }: CelebrationProps) {
  const rain = useMemo(
    () => pickRainEmojis(markDef(mark).emoji ?? null, big),
    [mark, big],
  )
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
          <Confetti winner={winner} />
        </div>
      ))}
    </div>
  )
}
