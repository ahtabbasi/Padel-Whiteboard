import { toPxX, toPxY } from '../lib/svgCoords';
import type { PlayerToken, Team } from '../types';

const HEAD_LENGTH = 14;
const HEAD_HALF_WIDTH = 7;

interface MovementArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  team: Team;
  onRemove?: () => void;
}

export function MovementArrow({ x1, y1, x2, y2, team, onRemove }: MovementArrowProps) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  if (length < 2) return null;

  const angle = Math.atan2(dy, dx);
  const baseX = x2 - HEAD_LENGTH * Math.cos(angle);
  const baseY = y2 - HEAD_LENGTH * Math.sin(angle);
  const leftX = baseX + HEAD_HALF_WIDTH * Math.cos(angle + Math.PI / 2);
  const leftY = baseY + HEAD_HALF_WIDTH * Math.sin(angle + Math.PI / 2);
  const rightX = baseX + HEAD_HALF_WIDTH * Math.cos(angle - Math.PI / 2);
  const rightY = baseY + HEAD_HALF_WIDTH * Math.sin(angle - Math.PI / 2);

  const handlePointerDown = (e: PointerEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <g className={`movement-arrow-group movement-arrow-group-${team}`}>
      <line x1={x1} y1={y1} x2={baseX} y2={baseY} className={`movement-arrow movement-arrow-${team}`} />
      <polygon
        points={`${x2},${y2} ${leftX},${leftY} ${rightX},${rightY}`}
        className={`movement-arrowhead movement-arrowhead-${team}`}
      />
      {onRemove && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          className="movement-arrow-hit"
          onPointerDown={handlePointerDown}
        />
      )}
    </g>
  );
}

interface ArrowLayerProps {
  players: PlayerToken[];
  onRemoveArrow: (playerId: string, arrowId: string) => void;
}

/**
 * Renders movement arrows for all players. Each arrow starts at the player's
 * live position and can be removed by clicking its line.
 */
export function ArrowLayer({ players, onRemoveArrow }: ArrowLayerProps) {
  return (
    <g className="arrow-layer">
      {players.flatMap((player) =>
        player.arrows.map((arrow) => (
          <MovementArrow
            key={arrow.id}
            x1={toPxX(player.pos.x)}
            y1={toPxY(player.pos.y)}
            x2={toPxX(arrow.target.x)}
            y2={toPxY(arrow.target.y)}
            team={player.team}
            onRemove={() => onRemoveArrow(player.id, arrow.id)}
          />
        )),
      )}
    </g>
  );
}
