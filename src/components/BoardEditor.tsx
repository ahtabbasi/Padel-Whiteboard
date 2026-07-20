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
import { SideMenu, useSideMenuActions } from './SideMenu';
import { Toolbar } from './Toolbar';
import { ZonesOverlay } from './ZonesOverlay';

interface BoardEditorProps {
  initialBoard: Board;
  onBoardChange: (board: Board) => void;
}

export function BoardEditor({ initialBoard, onBoardChange }: BoardEditorProps) {
  const { board, movePlayer, addArrow, removeArrow, moveBall, resetPositions } = useBoardEditor(initialBoard);
  const { settings, toggle } = useDisplaySettings();
  const [mode, setMode] = useState<EditorMode>('move');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const { boards, handleCreate, handleRename, handleDelete, handleDuplicate } = useSideMenuActions(onBoardChange);

  const handleModeChange = (nextMode: EditorMode) => {
    setMode(nextMode);
    setSelectedPlayerId(null);
  };

  const handleSelect = (id: string) => {
    setSelectedPlayerId((prev) => (prev === id ? null : id));
  };

  const handleCourtPointerDown = () => {
    setSelectedPlayerId(null);
  };

  return (
    <div className="board-editor">
      <header className="board-editor-header">
        <button type="button" className="icon-button hamburger-button" onClick={() => setMenuOpen(true)} aria-label="Open boards menu">
          <span className="hamburger-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <span className="board-editor-title">{board.name}</span>
      </header>

      <div className="court-container">
        <svg
          viewBox={`0 0 ${COURT_VIEW_WIDTH} ${COURT_VIEW_HEIGHT}`}
          className="court-svg"
          onPointerDown={handleCourtPointerDown}
        >
          <CourtSvg />
          {settings.showBorders && <BordersOverlay />}
          <ZonesOverlay settings={settings} />
          <BlackHoleOverlay players={board.players} settings={settings} />
          <HighPercentageZoneOverlay
            players={board.players}
            selectedPlayerId={selectedPlayerId}
            enabled={settings.showHighPercentageZone}
          />
          {settings.showBall && <BallToken pos={board.ball} onMove={moveBall} />}
          {board.players.map((player) => (
            <PlayerToken
              key={player.id}
              player={player}
              mode={mode}
              highPercentageEnabled={settings.showHighPercentageZone}
              isSelected={selectedPlayerId === player.id}
              onMove={(pos) => movePlayer(player.id, pos)}
              onArrowAdd={(target) => addArrow(player.id, target)}
              onSelect={() => handleSelect(player.id)}
            />
          ))}
          <ArrowLayer players={board.players} onRemoveArrow={removeArrow} />
        </svg>
      </div>

      <Toolbar mode={mode} onModeChange={handleModeChange} onOpenSettings={() => setSettingsOpen(true)} onReset={resetPositions} />

      <SideMenu
        open={menuOpen}
        boards={boards}
        activeBoardId={board.id}
        onClose={() => setMenuOpen(false)}
        onSelect={onBoardChange}
        onCreate={() => {
          handleCreate();
          setMenuOpen(false);
        }}
        onRename={handleRename}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      {settingsOpen && (
        <DisplaySettingsPanel settings={settings} onToggle={toggle} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
