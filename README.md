# Tic Tac Toe

A bold, playful, session-based Tic Tac Toe web app. Play unlimited rounds — or a
Best-of-3 / Best-of-5 match — against a friend on the same screen or against the
computer, with named players, emoji avatars, confetti, sound effects, and a
live match-room scoreboard.

## Features

- **Two modes** — local two-player (shared screen) or vs computer.
- **Match-room layout** — top bar + board + side panel with player cards,
  match progress pips, and round-by-round history.
- **Dark & light themes** — top-bar toggle, persisted, follows OS preference.
- **Best-of matches** — Free play, Best of 3, or Best of 5; clinch a match to
  get the trophy screen and a rematch option.
- **Named players + emoji avatars** — picked at session start; 🤖 for the CPU.
- **Three AI difficulties** — Easy (random), Medium (win/block heuristic), Hard
  (unbeatable minimax).
- **Fair rounds** — the starting player alternates every round.
- **Celebration FX** — confetti burst + synthesized sounds (WebAudio, no audio
  files) with a mute toggle; all motion respects `prefers-reduced-motion`.

## Stack

- React 19 + TypeScript + Vite 8
- Vitest for game-logic unit tests
- oxlint for linting
- Zero runtime dependencies beyond React — all styling is hand-crafted CSS,
  sounds are synthesized in the browser.

## Getting started

```bash
npm install
npm run dev
```

## Commands

| Command          | What it does                       |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start the dev server               |
| `npm run build`  | Type-check + production build      |
| `npm run test`   | Run the Vitest unit tests          |
| `npm run lint`   | Run oxlint                         |
| `npm run preview`| Preview the production build       |

## Project layout

```
src/
  game/           Pure, framework-free game rules and AI (unit-tested)
    logic.ts      Board model, win/draw detection, move helpers
    ai.ts         Difficulty tiers + minimax
    match.ts      Best-of series logic
    sound.ts      WebAudio sfx engine
  components/     TopBar, SetupScreen, GameScreen, SidePanel, Board,
                  Confetti, AvatarPicker
  theme.ts        Dark/light theme hook (localStorage + media query)
  App.tsx         Session state (scores, rounds, history, match)
```
