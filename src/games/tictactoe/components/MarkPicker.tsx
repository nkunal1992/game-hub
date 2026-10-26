import { FUN_MARKS, SHAPE_MARKS, type MarkDef } from '../marks'
import type { Player } from '../game/logic'
import MarkGlyph from './MarkGlyph'

interface MarkPickerProps {
  value: string
  onChange: (markId: string) => void
  /** Mark id reserved by the opponent — rendered disabled. */
  exclude?: string
  /** Seat whose color tints shape icons. */
  seat: Player
  'aria-label': string
}

function MarkOption({
  def,
  seat,
  selected,
  disabled,
  onChange,
}: {
  def: MarkDef
  seat: Player
  selected: boolean
  disabled: boolean
  onChange: (id: string) => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={def.label}
      title={def.label}
      disabled={disabled}
      className={`mark-opt${selected ? ' mark-opt--active' : ''}`}
      onClick={() => onChange(def.id)}
    >
      <MarkGlyph mark={def.id} seat={seat} mini />
    </button>
  )
}

export default function MarkPicker({
  value,
  onChange,
  exclude,
  seat,
  'aria-label': ariaLabel,
}: MarkPickerProps) {
  const renderGroup = (marks: MarkDef[], label: string) => (
    <div className="mark-group">
      <span className="mark-group-label">{label}</span>
      <div className="mark-grid" role="radiogroup" aria-label={`${ariaLabel} — ${label}`}>
        {marks.map((def) => (
          <MarkOption
            key={def.id}
            def={def}
            seat={seat}
            selected={value === def.id}
            disabled={def.id === exclude}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className={`mark-picker mark-picker--${seat.toLowerCase()}`}>
      {renderGroup(SHAPE_MARKS, 'Shapes')}
      {renderGroup(FUN_MARKS, 'Fun')}
    </div>
  )
}
