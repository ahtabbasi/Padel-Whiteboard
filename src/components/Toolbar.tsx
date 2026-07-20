import type { EditorMode } from '../types';

interface ToolbarProps {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onOpenSettings: () => void;
  onReset: () => void;
}

export function Toolbar({ mode, onModeChange, onOpenSettings, onReset }: ToolbarProps) {
  return (
    <nav className="toolbar">
      <div className="toolbar-modes">
        <button
          type="button"
          className={`toolbar-button${mode === 'move' ? ' toolbar-button-active' : ''}`}
          onClick={() => onModeChange('move')}
        >
          Move
        </button>
        <button
          type="button"
          className={`toolbar-button${mode === 'arrow' ? ' toolbar-button-active' : ''}`}
          onClick={() => onModeChange('arrow')}
        >
          Arrow
        </button>
      </div>
      <div className="toolbar-actions">
        <button type="button" className="toolbar-button" onClick={onReset}>
          Reset
        </button>
        <button
          type="button"
          className="toolbar-button toolbar-config-button"
          onClick={onOpenSettings}
          aria-label="Configuration"
        >
          <svg
            className="configuration-icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
