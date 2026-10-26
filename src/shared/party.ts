/** Kid-friendly celebration data — emoji rain + cannon bursts. */

export const PARTY_EMOJIS = ['🎉', '🥳', '⭐', '🌈', '🎈', '✨', '💥', '🍕', '🎊', '🍭']

export const MATCH_EMOJIS = ['🏆', '🥇', '🎆']

export interface RainItem {
  emoji: string
  /** horizontal position, % of viewport */
  left: number
  /** fall duration in seconds */
  dur: number
  /** animation delay in seconds (negative = already mid-fall) */
  delay: number
  size: number
}

export interface Burst {
  id: number
  /** horizontal launch point, % of viewport */
  x: number
}

/**
 * Build the emoji-rain payload. Includes the winner's own emoji piece (when it
 * is one) repeated for extra kid delight, plus trophy emojis on match wins.
 */
export function pickRainEmojis(
  winEmoji: string | null,
  big: boolean,
): RainItem[] {
  const count = big ? 40 : 26
  const pool = big
    ? [...PARTY_EMOJIS, ...MATCH_EMOJIS]
    : PARTY_EMOJIS
  return Array.from({ length: count }, (_, i) => {
    const emoji =
      winEmoji && i % 4 === 0 ? winEmoji : pool[i % pool.length]
    return {
      emoji,
      left: 2 + Math.random() * 96,
      dur: 3.2 + Math.random() * 3.5,
      delay: -Math.random() * 6,
      size: 22 + Math.random() * 22,
    }
  })
}

/** Alternating bottom-corner cannon positions with jitter. */
export function nextBurst(seq: number): Burst {
  const side = seq % 2 === 0
  const x = side ? 6 + Math.random() * 12 : 94 - Math.random() * 12
  return { id: seq, x }
}
