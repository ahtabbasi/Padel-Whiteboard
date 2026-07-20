import { getHighPercentageTriangleBisector, getHighPercentageZonePolygon } from '../lib/highPercentageZone';
import { toPxX, toPxY } from '../lib/svgCoords';
import type { PlayerToken } from '../types';

interface HighPercentageZoneOverlayProps {
  players: PlayerToken[];
  selectedPlayerId: string | null;
  enabled: boolean;
}

export function HighPercentageZoneOverlay({ players, selectedPlayerId, enabled }: HighPercentageZoneOverlayProps) {
  if (!enabled || !selectedPlayerId) return null;
  const player = players.find((p) => p.id === selectedPlayerId);
  if (!player) return null;

  const zonePoints = getHighPercentageZonePolygon(player.team, player.pos);
  const points = zonePoints.map((p) => `${toPxX(p.x)},${toPxY(p.y)}`).join(' ');

  const [bisectStart, bisectEnd] = getHighPercentageTriangleBisector(player.team, player.pos);

  return (
    <g className="high-percentage-zone-overlay">
      <polygon points={points} className={`high-percentage-zone high-percentage-zone-${player.team}`} />
      <line
        x1={toPxX(bisectStart.x)}
        y1={toPxY(bisectStart.y)}
        x2={toPxX(bisectEnd.x)}
        y2={toPxY(bisectEnd.y)}
        className={`high-percentage-bisector high-percentage-bisector-${player.team}`}
      />
    </g>
  );
}
