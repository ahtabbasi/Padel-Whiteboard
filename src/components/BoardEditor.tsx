import { useState } from 'preact/hooks';
import type { Board, EditorMode } from '../types';
import { useBoardEditor } from '../hooks/useBoardEditor';
import { useDisplaySettings } from '../hooks/useDisplaySettings';
import { COURT_VIEW_HEIGHT, COURT_VIEW_WIDTH } from '../lib/courtGeometry';
import { ArrowLayer } from './ArrowLayer';
import { BallToken } from './BallToken';
import { BlackHoleOverlay } from './BlackHoleOverlay';
import { BordersOverlay } from './BordersOverlay';
import { CourtSvg } from './CourtSvg';
import { DisplaySettingsPanel } from './DisplaySettingsPanel';
import { HighPercentageZoneOverlay } from './HighPercentageZoneOverlay';
import { PlayerToken } from './PlayerToken';
import { Toolbar } from './Toolbar';
import { ZonesOverlay } from './ZonesOverlay';

interface BoardEditorProps {
  initialBoard: Board;
  onBack: () => void;
}

export function BoardEditor({ initialBoard, onBack }: BoardEditorProps) {
  const { board, movePlayer, setArrow, clearArrow, moveBall, resetPositions, saved } = useBoardEditor(initialBoard);
  const { settings, toggle } = useDisplaySettings();
  const [mode, setMode] = useState<EditorMode>('move');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const handleModeChange = (nextMode: EditorMode) => {
    setMode(nextMode);
    setSelectedPlayerId(null);
  };

  const handleSelect = (id: string) => {
    setSelectedPlayerId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="board-editor">
      <header className="board-editor-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="Back to library">
          ←
        </button>
        <span className="board-editor-title">{board.name}</span>
        <span className={`saved-indicator${saved ? ' saved' : ''}`}>{saved ? 'Saved' : 'Saving…'}</span>
      </header>

      <div className="court-container">
        <svg viewBox={`0 0 ${COURT_VIEW_WIDTH} ${COURT_VIEW_HEIGHT}`} className="court-svg">
          <defs>
            <marker id="arrowhead-A" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
              <path d="M0,0 L8,4 L0,8 Z" className="arrowhead arrowhead-A" />
            </marker>
            <marker id="arrowhead-B" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse">
              <path d="M0,0 L8,4 L0,8 Z" className="arrowhead arrowhead-B" />
            </marker>
          </defs>

          <CourtSvg />
          {settings.showBorders && <BordersOverlay />}
          <ZonesOverlay settings={settings} />
          <BlackHoleOverlay players={board.players} settings={settings} />
          <HighPercentageZoneOverlay
            players={board.players}
            selectedPlayerId={selectedPlayerId}
            enabled={settings.showHighPercentageZone}
          />
          <ArrowLayer players={board.players} />
          {settings.showBall && <BallToken pos={board.ball} onMove={moveBall} />}
          {board.players.map((player) => (
            <PlayerToken
              key={player.id}
              player={player}
              mode={mode}
              highPercentageEnabled={settings.showHighPercentageZone}
              isSelected={selectedPlayerId === player.id}
              onMove={(pos) => movePlayer(player.id, pos)}
              onArrowUpdate={(target) => setArrow(player.id, target)}
              onArrowClear={() => clearArrow(player.id)}
              onSelect={() => handleSelect(player.id)}
            />
          ))}
        </svg>
      </div>

      <Toolbar mode={mode} onModeChange={handleModeChange} onOpenSettings={() => setSettingsOpen(true)} onReset={resetPositions} />

      {settingsOpen && (
        <DisplaySettingsPanel settings={settings} onToggle={toggle} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
