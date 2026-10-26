# Game Hub — Tic Tac Toe & Ludo

[![Deploy](https://github.com/nkunal1992/game-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/nkunal1992/game-hub/actions/workflows/deploy.yml)

**[▶ Play it live](https://nkunal-game-hub.netlify.app)**

A bold, playful game hub. Two classic board games behind a tab switcher —
**Tic Tac Toe** and **Ludo** — each with its own session: play with friends on
the same screen or against the computer, with named players, emoji avatars,
and looping win celebrations. Fully silent — no audio.

## Games

### ❌ Tic Tac Toe
- Local two-player or vs computer (Easy / Medium / Hard minimax)
- Free play, Best of 3, Best of 5 matches; scores persist for the session
- 11 stroke-drawn shape marks + 17 fun emoji marks per player

### 🎲 Ludo
- 2–4 seats; each seat is a named human or a CPU (Easy / Smart heuristics)
- **Classic rules** — roll 6 to leave base, exact roll to finish, extra turn
  on a 6, three 6s forfeit · **Kids rules** — leave base on any roll, big
  rolls still finish, no forfeits
- Captures on non-safe squares, 8 safe star squares, standard 15×15 board
- Animated dice, movable-token highlights, token glide animations

## Shared

- **Match-room layout** — tab bar + board + side panel with player cards,
  progress, and history
- **Dark & light themes** — top-bar toggle, persisted, follows OS preference
- **Emoji avatars** — picked per player in setup (🤖 for CPU seats)
- **Celebration FX** — looping confetti cannons + emoji rain in the winner's
  color; all motion respects `prefers-reduced-motion`
- Sessions stay alive when switching tabs — no lost games

## Stack

- React 19 + TypeScript + Vite 8
- Vitest for game-logic unit tests
- oxlint for linting
- Zero runtime dependencies beyond React — all styling is hand-crafted CSS

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
  App.tsx             Hub shell — tab switching, theme (both games stay mounted)
  games.ts            Game registry (tab labels/icons)
  shared/             TopBar, Celebration, Confetti, AvatarPicker, theme,
                      avatars, party.ts (celebration data)
  games/tictactoe/    TicTacToe.tsx + components/ + game/ (logic, ai, match)
                      + marks/types (all unit-tested)
  games/ludo/         LudoGame.tsx + components/ (board, dice, setup, screen)
                      + game/ (board geometry, engine, ai — all unit-tested)
  index.css           Hand-crafted design system
```

## Deployment

Static site on Netlify — every push to `main` runs lint → tests → build →
production deploy via `.github/workflows/deploy.yml`. Build config in
`netlify.toml`; `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` live in GitHub
secrets.
