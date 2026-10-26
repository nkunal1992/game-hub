import { AVATARS } from '../avatars'

interface AvatarPickerProps {
  value: string
  onChange: (emoji: string) => void
  'aria-label': string
}

export default function AvatarPicker({ value, onChange, 'aria-label': ariaLabel }: AvatarPickerProps) {
  return (
    <div className="avatar-picker" role="radiogroup" aria-label={ariaLabel}>
      {AVATARS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          role="radio"
          aria-checked={value === emoji}
          aria-label={`Avatar ${emoji}`}
          className={`avatar-opt${value === emoji ? ' avatar-opt--active' : ''}`}
          onClick={() => onChange(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
