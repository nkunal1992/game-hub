/** Cheerful spoken announcements via the Web Speech API — no audio assets. */

import { isMuted } from './sound'

const WIN_LINES = [
  'WOOHOO! {name} wins the round!',
  'Oh my gosh oh my gosh! {name} actually did it!',
  'Yippie yo! {name} takes the win!',
  'Ding ding ding! {name} is the winner!',
  '{name} is on FIRE! What a move!',
  'Unbelievable! {name} crushed it!',
]

const MATCH_LINES = [
  'CHAMPION ALERT! {name} wins the whole match!',
  'Everybody stand up and cheer for {name}, the match champion!',
  '{name} is the Tic Tac Toe MASTER! Match won!',
  'It is official! {name} is the champion of champions!',
]

const DRAW_LINES = [
  "It's a draw! You are BOTH equally awesome!",
  'Tie game! Shake hands, you two!',
  'Nobody wins?! Run it back!',
  'A draw! You two are TOO evenly matched!',
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
  u.pitch = 1.45 // cartoon-hype energy
  u.rate = 1.1
  u.volume = 1
  s.speak(u)
}

export function stopVoice() {
  synth()?.cancel()
}

export const announceWin = (name: string) => speak(pickLine(WIN_LINES, name))
export const announceMatchWin = (name: string) => speak(pickLine(MATCH_LINES, name))
export const announceDraw = () => speak(pickLine(DRAW_LINES, 'friend'))
