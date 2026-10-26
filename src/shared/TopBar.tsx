import { GAMES, type GameId } from '../games'
import type { Theme } from './theme'

function BrandMark() {
  return (
    <svg viewBox="0 0 48 48" className="brand-mark" aria-hidden="true">
      <rect x="1.5" y="1.5" width="45" height="45" rx="12" className="brand-tile" />
      <circle cx="15" cy="15" r="4" className="brand-pip" />
      <circle cx="33" cy="15" r="4" className="brand-pip" />
      <circle cx="24" cy="24" r="4" className="brand-pip" />
      <circle cx="15" cy="33" r="4" className="brand-pip" />
      <circle cx="33" cy="33" r="4" className="brand-pip" />
    </svg>
  )
}

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === 'dark' ? (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" fill="currentColor" />
      <path
        d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5 5l1.8 1.8M17.2 17.2L19 19M19 5l-1.8 1.8M6.8 17.2L5 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"
        fill="currentColor"
      />
    </svg>
  )
}

interface TopBarProps {
  theme: Theme
  active: GameId
  onSwitch: (game: GameId) => void
  onToggleTheme: () => void
}

export default function TopBar({ theme, active, onSwitch, onToggleTheme }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand-row">
        <BrandMark />
        <span className="wordmark">Game Hub</span>
      </div>
      <nav className="game-tabs" role="tablist" aria-label="Games">
        {GAMES.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            aria-selected={active === g.id}
            className={`game-tab${active === g.id ? ' game-tab--active' : ''}`}
            onClick={() => onSwitch(g.id)}
          >
            <span aria-hidden="true">{g.icon}</span> {g.label}
          </button>
        ))}
      </nav>
      <div className="topbar-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title="Toggle theme"
        >
          <ThemeIcon theme={theme} />
        </button>
      </div>
    </header>
  )
}
