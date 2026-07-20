import { useCallback } from 'preact/hooks';
import { usePointerDrag } from '../hooks/usePointerDrag';
import { toPxX, toPxY } from '../lib/svgCoords';
import type { Point } from '../types';

const BALL_RADIUS = 9;
/** Larger invisible circle so the touch target is comfortably tappable on phones. */
const HIT_RADIUS = 20;

interface BallTokenProps {
  pos: Point;
  onMove: (pos: Point) => void;
}

/** Always draggable regardless of Move/Arrow mode; visibility is controlled by the caller. */
export function BallToken({ pos, onMove }: BallTokenProps) {
  const handleMove = useCallback((point: Point) => onMove(point), [onMove]);
  const handleEnd = useCallback(() => {}, []);
  const { onPointerDown, onPointerMove, onPointerUp } = usePointerDrag({ onMove: handleMove, onEnd: handleEnd });
  const cx = toPxX(pos.x);
  const cy = toPxY(pos.y);

  return (
    <g
      className="ball-token-group"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <circle cx={cx} cy={cy} r={HIT_RADIUS} className="ball-token-hit-area" />
      <circle cx={cx} cy={cy} r={BALL_RADIUS} className="ball-token" />
    </g>
  );
}
