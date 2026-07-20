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
        <button type="button" className="toolbar-button" onClick={onOpenSettings}>
          Display
        </button>
      </div>
    </nav>
  );
}
