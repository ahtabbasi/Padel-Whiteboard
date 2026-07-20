import { useCallback } from 'preact/hooks';
import { usePointerDrag } from '../hooks/usePointerDrag';
import { toPxX, toPxY } from '../lib/svgCoords';
import type { EditorMode, PlayerToken as PlayerTokenModel, Point } from '../types';

const PLAYER_RADIUS = 15;
/** Larger invisible circle so the touch target is comfortably tappable on phones. */
const HIT_RADIUS = 24;

interface PlayerTokenProps {
  player: PlayerTokenModel;
  mode: EditorMode;
  highPercentageEnabled: boolean;
  isSelected: boolean;
  onMove: (pos: Point) => void;
  onArrowUpdate: (target: Point) => void;
  onArrowClear: () => void;
  onSelect: () => void;
}

export function PlayerToken({
  player,
  mode,
  highPercentageEnabled,
  isSelected,
  onMove,
  onArrowUpdate,
  onArrowClear,
  onSelect,
}: PlayerTokenProps) {
  const handleMove = useCallback(
    (point: Point) => {
      if (mode === 'move') onMove(point);
      else onArrowUpdate(point);
    },
    [mode, onMove, onArrowUpdate],
  );

  const handleEnd = useCallback(
    (_point: Point, wasTap: boolean) => {
      if (!wasTap) return;
      if (mode === 'move') {
        if (highPercentageEnabled) onSelect();
      } else if (player.arrowTarget) {
        onArrowClear();
      }
    },
    [mode, highPercentageEnabled, onSelect, onArrowClear, player.arrowTarget],
  );

  const { onPointerDown, onPointerMove, onPointerUp } = usePointerDrag({ onMove: handleMove, onEnd: handleEnd });

  const cx = toPxX(player.pos.x);
  const cy = toPxY(player.pos.y);

  return (
    <g
      className={`player-token player-token-${player.team}${isSelected ? ' player-token-selected' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <circle cx={cx} cy={cy} r={HIT_RADIUS} className="player-token-hit-area" />
      {isSelected && <circle cx={cx} cy={cy} r={PLAYER_RADIUS + 6} className="player-token-selection-ring" />}
      <circle cx={cx} cy={cy} r={PLAYER_RADIUS} className="player-token-dot" />
    </g>
  );
}
