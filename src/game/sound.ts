/** Tiny synthesized sound effects — no audio assets, lazily-init AudioContext. */

export type SoundName =
  | 'place-x'
  | 'place-o'
  | 'win'
  | 'lalala'
  | 'celebrate'
  | 'draw'
  | 'click'

const MUTE_KEY = 'ttt-muted'

let ctx: AudioContext | null = null
let muted = false

try {
  muted = localStorage.getItem(MUTE_KEY) === '1'
} catch {
  muted = false
}

export const isMuted = () => muted

export function setMuted(value: boolean) {
  muted = value
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0')
  } catch {
    // ignore — mute still applies in-memory
  }
}

function audioContext(): AudioContext | null {
  if (muted) return null
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(
  ac: AudioContext,
  freq: number,
  delay: number,
  duration: number,
  type: OscillatorType = 'triangle',
  peak = 0.09,
  endFreq?: number,
) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  const t0 = ac.currentTime + delay
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (endFreq) {
    osc.frequency.linearRampToValueAtTime(endFreq, t0 + duration * 0.85)
  }
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export function play(name: SoundName) {
  const ac = audioContext()
  if (!ac) return
  switch (name) {
    case 'place-x':
      tone(ac, 540, 0, 0.08, 'triangle', 0.1)
      break
    case 'place-o':
      tone(ac, 400, 0, 0.08, 'triangle', 0.1)
      break
    case 'win':
      // silly slide-whistle up, then the fanfare triad
      tone(ac, 320, 0, 0.2, 'sine', 0.07, 660)
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(ac, f, 0.12 + i * 0.08, 0.22, 'triangle', 0.09),
      )
      break
    case 'lalala': {
      // the universal kids' tease: sol-mi-la-mi-soool
      const tease = [392, 329.63, 440, 329.63, 392]
      tease.forEach((f, i) =>
        tone(ac, f, i * 0.16, i === tease.length - 1 ? 0.34 : 0.14, 'square', 0.055),
      )
      break
    }
    case 'celebrate':
      // bigger slide whistle + fanfare + sparkle tail for match wins
      tone(ac, 240, 0, 0.38, 'sine', 0.08, 980)
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        tone(ac, f, 0.28 + i * 0.08, 0.24, 'triangle', 0.09),
      )
      ;[1046.5, 1318.5, 1567.98].forEach((f, i) =>
        tone(ac, f, 0.6 + i * 0.07, 0.2, 'sine', 0.05),
      )
      break
    case 'draw':
      // descending "womp" slide whistle
      tone(ac, 420, 0, 0.3, 'sine', 0.08, 170)
      break
    case 'click':
      tone(ac, 720, 0, 0.045, 'sine', 0.06)
      break
  }
}
