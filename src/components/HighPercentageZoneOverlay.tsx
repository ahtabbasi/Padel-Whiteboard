import { getHighPercentageTargets } from '../lib/highPercentageZone';
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

  const [t1, t2] = getHighPercentageTargets(player.team, player.pos);
  const points = [
    `${toPxX(player.pos.x)},${toPxY(player.pos.y)}`,
    `${toPxX(t1.x)},${toPxY(t1.y)}`,
    `${toPxX(t2.x)},${toPxY(t2.y)}`,
  ].join(' ');

  return (
    <g className="high-percentage-zone-overlay">
      <polygon points={points} className={`high-percentage-zone high-percentage-zone-${player.team}`} />
    </g>
  );
}
