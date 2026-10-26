# Tic Tac Toe

[![Deploy](https://github.com/nkunal1992/tic-tac-toe/actions/workflows/deploy.yml/badge.svg)](https://github.com/nkunal1992/tic-tac-toe/actions/workflows/deploy.yml)

**[▶ Play it live](https://nkunal-tic-tac-toe.netlify.app)**

A bold, playful, session-based Tic Tac Toe web app. Play unlimited rounds — or a
Best-of-3 / Best-of-5 match — against a friend on the same screen or against the
computer, with named players, emoji avatars, confetti, and a
live match-room scoreboard.

## Features

- **Two modes** — local two-player (shared screen) or vs computer.
- **Match-room layout** — top bar + board + side panel with player cards,
  match progress pips, and round-by-round history.
- **Dark & light themes** — top-bar toggle, persisted, follows OS preference.
- **Best-of matches** — Free play, Best of 3, or Best of 5; clinch a match to
  get the trophy screen and a rematch option.
- **Named players + emoji avatars** — picked at session start; 🤖 for the CPU.
- **Custom board pieces** — each player picks a mark: 11 stroke-drawn shapes
  (cross, circle, triangle, square, diamond, pentagon, hexagon, star, heart,
  plus, bolt) or 17 fun emoji (🐸🦄🦖🐝🐙🐢🦊🐼🐱🐶🦁🐥🐠👻🚀🍕🤖) —
  great for kids. Marks render on the board, in ghost previews, player cards,
  and screen-reader labels.
- **Three AI difficulties** — Easy (random), Medium (win/block heuristic), Hard
  (unbeatable minimax).
- **Fair rounds** — the starting player alternates every round.
- **Celebration FX** — looping confetti cannons + emoji rain on wins; all
  motion respects `prefers-reduced-motion`. Fully silent — no audio.

## Stack

- React 19 + TypeScript + Vite 8
- Vitest for game-logic unit tests
- oxlint for linting
- Zero runtime dependencies beyond React — all styling is hand-crafted CSS.

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
  components/     TopBar, SetupScreen, GameScreen, SidePanel, Board,
                  Confetti, AvatarPicker, MarkPicker, MarkGlyph
  marks.ts        Custom piece catalog (shapes + emoji marks)
  avatars.ts      Player avatar emoji list
  theme.ts        Dark/light theme hook (localStorage + media query)
  App.tsx         Session state (scores, rounds, history, match)
```
