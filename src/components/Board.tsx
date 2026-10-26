import { LINES, type Board, type Player } from '../game/logic'

function Mark({ symbol, ghost = false }: { symbol: Player; ghost?: boolean }) {
  const cls = `mark mark-${symbol.toLowerCase()}${ghost ? ' mark--ghost' : ''}`
  if (symbol === 'X') {
    return (
      <svg viewBox="0 0 100 100" className={cls} aria-hidden="true">
        <line className="mark-stroke mark-stroke--1" x1="28" y1="28" x2="72" y2="72" pathLength={1} />
        <line className="mark-stroke mark-stroke--2" x1="72" y1="28" x2="28" y2="72" pathLength={1} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 100 100" className={cls} aria-hidden="true">
      <circle className="mark-stroke" cx="50" cy="50" r="23" pathLength={1} />
    </svg>
  )
}

/** Pixel-space endpoints for each winning line on a 300×300 board. */
const LINE_PATHS: Record<number, [number, number, number, number]> = {
  0: [28, 50, 272, 50],
  1: [28, 150, 272, 150],
  2: [28, 250, 272, 250],
  3: [50, 28, 50, 272],
  4: [150, 28, 150, 272],
  5: [250, 28, 250, 272],
  6: [46, 46, 254, 254],
  7: [254, 46, 46, 254],
}

interface BoardProps {
  board: Board
  turn: Player
  winLine: readonly number[] | null
  winner: Player | null
  interactive: boolean
  onCellClick: (index: number) => void
}

const ROW_COL = ['top-left', 'top-center', 'top-right', 'middle-left', 'middle-center', 'middle-right', 'bottom-left', 'bottom-center', 'bottom-right']

export default function GameBoard({ board, turn, winLine, winner, interactive, onCellClick }: BoardProps) {
  const lineIdx = winLine
    ? LINES.findIndex((l) => l[0] === winLine[0] && l[1] === winLine[1] && l[2] === winLine[2])
    : -1
  const winSet = new Set(winLine ?? [])

  return (
    <div className="board" role="grid" aria-label="Tic tac toe board">
      {board.map((cell, i) => {
        const playable = interactive && cell === null
        return (
          <button
            key={i}
            type="button"
            role="gridcell"
            className={`cell${cell ? ` cell--filled cell--${cell.toLowerCase()}` : ''}${winSet.has(i) ? ' cell--win' : ''}`}
            style={{ animationDelay: `${i * 24}ms` }}
            disabled={!playable}
            aria-label={cell ? `${ROW_COL[i]}, ${cell}` : `${ROW_COL[i]}, place ${turn}`}
            onClick={() => onCellClick(i)}
          >
            {cell ? <Mark symbol={cell} /> : playable ? <Mark symbol={turn} ghost /> : null}
          </button>
        )
      })}
      {lineIdx >= 0 && winner && (
        <svg className={`winline winline--${winner.toLowerCase()}`} viewBox="0 0 300 300" aria-hidden="true">
          <line
            x1={LINE_PATHS[lineIdx][0]}
            y1={LINE_PATHS[lineIdx][1]}
            x2={LINE_PATHS[lineIdx][2]}
            y2={LINE_PATHS[lineIdx][3]}
            pathLength={1}
          />
        </svg>
      )}
    </div>
  )
}
