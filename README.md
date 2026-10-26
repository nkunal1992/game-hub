# Tic Tac Toe

A polished, session-based Tic Tac Toe web app. Play unlimited rounds against a
friend on the same screen, or against the computer — with named players and a
session scoreboard that tracks wins and draws across the whole match.

## Features

- **Two modes** — local two-player (shared screen) or vs computer.
- **Named players** — enter names at the start of a session; they appear on the
  scoreboard and in round announcements.
- **Session scoring** — cumulative wins per player plus a draw counter, kept
  across as many rounds as you want.
- **Three AI difficulties** — Easy (random), Medium (win/block heuristic), and
  Hard (unbeatable minimax).
- **Fair rounds** — the starting player alternates every round.
- **Polished feel** — dark glass aesthetic, stroke-drawn X/O marks, animated
  winning line, score-bump and turn indicators, responsive down to mobile.

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
  game/          Pure, framework-free game rules and AI (unit-tested)
    logic.ts     Board model, win/draw detection, move helpers
    ai.ts        Difficulty tiers + minimax
  components/    SetupScreen, GameScreen, Scoreboard, Board
  App.tsx        Session state (scores, rounds, screen routing)
```
