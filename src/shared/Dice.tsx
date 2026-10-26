const PIPS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
}

interface DiceProps {
  /** Current face, or null before the first roll. */
  value: number | null
  rolling: boolean
  disabled: boolean
  onRoll: () => void
  label: string
}

export default function Dice({ value, rolling, disabled, onRoll, label }: DiceProps) {
  const face = value ?? 6
  return (
    <button
      type="button"
      className={`dice${rolling ? ' dice--rolling' : ''}`}
      onClick={onRoll}
      disabled={disabled || rolling}
      aria-label={label}
    >
      {PIPS[face].map(([r, c]) => (
        <span key={`${r}${c}`} className="dice-pip" style={{ gridRow: r + 1, gridColumn: c + 1 }} />
      ))}
    </button>
  )
}
