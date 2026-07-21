import type { DisplaySettings } from '../types';

interface DisplaySettingsPanelProps {
  settings: DisplaySettings;
  onToggle: (key: keyof DisplaySettings) => void;
  onClose: () => void;
}

const TOGGLES: { key: keyof DisplaySettings; label: string }[] = [
  { key: 'moveTogether', label: 'Move together (team)' },
  { key: 'showBlackHoleTeamA', label: 'Black hole — Team A (yellow, bottom)' },
  { key: 'showBlackHoleTeamB', label: 'Black hole — Team B (red, top)' },
  { key: 'showNoManZone', label: 'No-man zone' },
  { key: 'showBorders', label: 'Glass / fence borders' },
  { key: 'showHighPercentageZone', label: 'High-percentage shot zone' },
];

export function DisplaySettingsPanel({ settings, onToggle, onClose }: DisplaySettingsPanelProps) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <span className="sheet-title">Configuration</span>
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
