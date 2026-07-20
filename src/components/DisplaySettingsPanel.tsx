import type { DisplaySettings } from '../types';

interface DisplaySettingsPanelProps {
  settings: DisplaySettings;
  onToggle: (key: keyof DisplaySettings) => void;
  onClose: () => void;
}

const TOGGLES: { key: keyof DisplaySettings; label: string }[] = [
  { key: 'showBall', label: 'Ball' },
  { key: 'showBlackHoleTeamA', label: 'Black hole — Team A (red)' },
  { key: 'showBlackHoleTeamB', label: 'Black hole — Team B (blue)' },
  { key: 'showAttackZone', label: 'Attack zone' },
  { key: 'showNoManZone', label: 'No-man zone' },
  { key: 'showDefenceZone', label: 'Defence zone' },
  { key: 'showBorders', label: 'Glass / fence borders' },
  { key: 'showHighPercentageZone', label: 'High-percentage shot zone' },
];

export function DisplaySettingsPanel({ settings, onToggle, onClose }: DisplaySettingsPanelProps) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <span className="sheet-title">Display</span>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <ul className="toggle-list">
          {TOGGLES.map(({ key, label }) => (
            <li key={key} className="toggle-row">
              <span>{label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings[key]}
                className={`switch${settings[key] ? ' switch-on' : ''}`}
                onClick={() => onToggle(key)}
              >
                <span className="switch-knob" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
