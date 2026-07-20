import { useCallback } from 'preact/hooks';
import { usePointerDrag } from '../hooks/usePointerDrag';
import { toPxX, toPxY } from '../lib/svgCoords';
import type { EditorMode, PlayerToken as PlayerTokenModel, Point } from '../types';

/** Classic user silhouette (head + shoulders), 20×20 viewBox. */
const USER_ICON_PATH = 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 8a7 7 0 1114 0H3z';
const ICON_SCALE = 1.6;
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
      <g transform={`translate(${cx}, ${cy}) scale(${ICON_SCALE}) translate(-10, -10)`}>
        <path fillRule="evenodd" d={USER_ICON_PATH} className="player-icon-shape" />
      </g>
    </g>
  );
}
