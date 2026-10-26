import type { Theme } from '../theme'

function BrandMark() {
  return (
    <svg viewBox="0 0 48 48" className="brand-mark" aria-hidden="true">
      <rect x="1.5" y="1.5" width="45" height="45" rx="12" className="brand-tile" />
      <path d="M17.5 1.5v45M30.5 1.5v45M1.5 17.5h45M1.5 30.5h45" className="brand-grid" />
      <path d="M6.5 6.5l8 8M14.5 6.5l-8 8" className="brand-x" />
      <circle cx="24" cy="37.5" r="4.6" className="brand-o" />
    </svg>
  )
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 9v6h4l5 4V5L8 9H4z"
        fill="currentColor"
      />
      {muted ? (
        <path
          d="M16 9l5 6M21 9l-5 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
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
  muted: boolean
  round?: number
  onToggleTheme: () => void
  onToggleMute: () => void
  onNewSession?: () => void
}

export default function TopBar({
  theme,
  muted,
  round,
  onToggleTheme,
  onToggleMute,
  onNewSession,
}: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand-row">
        <BrandMark />
        <span className="wordmark">Tic·Tac·Toe</span>
      </div>
      <div className="topbar-actions">
        {round !== undefined && <span className="round-pill">Round {round}</span>}
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
          title={muted ? 'Unmute' : 'Mute'}
        >
          <SpeakerIcon muted={muted} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title="Toggle theme"
        >
          <ThemeIcon theme={theme} />
        </button>
        {onNewSession && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onNewSession}>
            New session
          </button>
        )}
      </div>
    </header>
  )
}
