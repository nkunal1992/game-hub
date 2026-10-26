/** Cheerful spoken announcements via the Web Speech API — no audio assets. */

import { isMuted } from './sound'

const WIN_LINES = [
  'Yay, {name} wins!',
  'Woohoo! {name} did it!',
  'Awesome, {name}!',
  '{name} is the winner! Way to go!',
  'Yes yes yes! {name} takes it!',
]

const MATCH_LINES = [
  '{name} wins the whole match! Champion!',
  'Amazing! {name} is the match champion!',
  'Hooray hooray! {name} takes the match!',
]

const DRAW_LINES = [
  "It's a draw! Good game everybody!",
  'A tie! Nobody wins this one!',
  'So close! That round was a draw!',
]

/** Pick a random line and interpolate {name}. */
export function pickLine(lines: string[], name: string): string {
  const template = lines[Math.floor(Math.random() * lines.length)]
  return template.replaceAll('{name}', name)
}

function synth(): SpeechSynthesis | null {
  try {
    return window.speechSynthesis ?? null
  } catch {
    return null
  }
}

export function speak(text: string) {
  if (isMuted()) return
  const s = synth()
  if (!s) return
  s.cancel() // never stack announcements
  const u = new SpeechSynthesisUtterance(text)
  u.pitch = 1.3 // cheerful, kid-friendly
  u.rate = 1.05
  u.volume = 1
  s.speak(u)
}

export function stopVoice() {
  synth()?.cancel()
}

export const announceWin = (name: string) => speak(pickLine(WIN_LINES, name))
export const announceMatchWin = (name: string) => speak(pickLine(MATCH_LINES, name))
export const announceDraw = () => speak(pickLine(DRAW_LINES, 'friend'))
