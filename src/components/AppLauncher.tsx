import type { AppId } from '../types';

interface AppLauncherProps {
  onSelect: (appId: AppId) => void;
}

export function AppLauncher({ onSelect }: AppLauncherProps) {
  return (
    <div className="launcher">
      <div className="launcher-intro">
        <h1 className="launcher-title">Padel Buddy</h1>
        <p className="launcher-subtitle">Choose a tool to get started.</p>
      </div>

      <div className="launcher-grid">
        <button type="button" className="launcher-card" onClick={() => onSelect('strategist')}>
          <span className="launcher-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="12" y1="4" x2="12" y2="20" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <circle cx="7.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
              <circle cx="16.5" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="launcher-card-name">Strategist</span>
          <span className="launcher-card-desc">Plan formations and movement on a tactics board.</span>
        </button>

        <button type="button" className="launcher-card" onClick={() => onSelect('tournament')}>
          <span className="launcher-card-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
              <path d="M8 5H5a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3" />
              <path d="M16 5h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3" />
              <line x1="12" y1="12" x2="12" y2="16" />
              <line x1="9" y1="20" x2="15" y2="20" />
              <line x1="12" y1="16" x2="12" y2="20" />
            </svg>
          </span>
          <span className="launcher-card-name">Tournament</span>
          <span className="launcher-card-desc">Run a round robin night: teams, schedule, and standings.</span>
        </button>
      </div>
    </div>
  );
}
