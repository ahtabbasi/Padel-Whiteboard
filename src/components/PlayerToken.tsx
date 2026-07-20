import { useCallback, useState } from 'preact/hooks';
import { usePointerDrag } from '../hooks/usePointerDrag';
import { toPxX, toPxY } from '../lib/svgCoords';
import type { EditorMode, PlayerToken as PlayerTokenModel, Point } from '../types';
import { MovementArrow } from './ArrowLayer';

/** Classic user silhouette (head + shoulders), 20×20 viewBox. */
const USER_ICON_PATH = 'M10 9a3 3 0 100-6 3 3 0 000 6zm-7 8a7 7 0 1114 0H3z';
const ICON_SCALE = 1.936;
const HIT_RADIUS = 29;

interface PlayerTokenProps {
  player: PlayerTokenModel;
  mode: EditorMode;
  highPercentageEnabled: boolean;
  isSelected: boolean;
  onMove: (pos: Point) => void;
  onArrowAdd: (target: Point) => void;
  onSelect: () => void;
}

export function PlayerToken({
  player,
  mode,
  highPercentageEnabled,
  isSelected,
  onMove,
  onArrowAdd,
  onSelect,
}: PlayerTokenProps) {
  const [previewTarget, setPreviewTarget] = useState<Point | null>(null);

  const handleMove = useCallback(
    (point: Point) => {
      if (mode === 'move') onMove(point);
      else setPreviewTarget(point);
    },
    [mode, onMove],
  );

  const handleEnd = useCallback(
    (point: Point, wasTap: boolean) => {
      if (mode === 'arrow') {
        if (!wasTap) onArrowAdd(point);
        setPreviewTarget(null);
        return;
      }
      if (wasTap && highPercentageEnabled) onSelect();
    },
    [mode, highPercentageEnabled, onSelect, onArrowAdd],
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
      {mode === 'arrow' && previewTarget && (
        <MovementArrow
          x1={cx}
          y1={cy}
          x2={toPxX(previewTarget.x)}
          y2={toPxY(previewTarget.y)}
          team={player.team}
        />
      )}
      <circle cx={cx} cy={cy} r={HIT_RADIUS} className="player-token-hit-area" />
      <g transform={`translate(${cx}, ${cy}) scale(${ICON_SCALE}) translate(-10, -10)`}>
        <path fillRule="evenodd" d={USER_ICON_PATH} className="player-icon-shape" />
      </g>
    </g>
  );
}
