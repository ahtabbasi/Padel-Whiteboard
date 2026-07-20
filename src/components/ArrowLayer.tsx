import { toPxX, toPxY } from '../lib/svgCoords';
import type { PlayerToken } from '../types';

interface ArrowLayerProps {
  players: PlayerToken[];
}

/**
 * Renders each player's single movement arrow (if any). The arrow's start is
 * always the player's live position, so it automatically follows the player
 * when dragged in Move mode — no extra bookkeeping needed. The drag-to-set
 * gesture itself lives on the PlayerToken (that's where the pointer events
 * originate); this component is rendering-only.
 */
export function ArrowLayer({ players }: ArrowLayerProps) {
  return (
    <g className="arrow-layer">
      {players.map((player) => {
        if (!player.arrowTarget) return null;
        const x1 = toPxX(player.pos.x);
        const y1 = toPxY(player.pos.y);
        const x2 = toPxX(player.arrowTarget.x);
        const y2 = toPxY(player.arrowTarget.y);
        return (
          <line
            key={player.id}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            className={`movement-arrow movement-arrow-${player.team}`}
            markerEnd={`url(#arrowhead-${player.team})`}
          />
        );
      })}
    </g>
  );
}
