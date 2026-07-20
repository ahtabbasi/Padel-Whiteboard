import { toPxX, toPxY } from '../lib/svgCoords';
import type { DisplaySettings, PlayerToken } from '../types';

interface BlackHoleOverlayProps {
  players: PlayerToken[];
  settings: DisplaySettings;
}

const BLACK_HOLE_RADIUS = 8;

function TeamBlackHole({ players, team }: { players: PlayerToken[]; team: 'A' | 'B' }) {
  const teamPlayers = players.filter((p) => p.team === team);
  if (teamPlayers.length < 2) return null;
  const [p1, p2] = teamPlayers;
  const midX = (p1.pos.x + p2.pos.x) / 2;
  const midY = (p1.pos.y + p2.pos.y) / 2;

  return (
    <g className={`black-hole black-hole-${team}`}>
      <line x1={toPxX(p1.pos.x)} y1={toPxY(p1.pos.y)} x2={toPxX(p2.pos.x)} y2={toPxY(p2.pos.y)} className="black-hole-line" />
      <circle cx={toPxX(midX)} cy={toPxY(midY)} r={BLACK_HOLE_RADIUS} className="black-hole-dot" />
    </g>
  );
}

/** Per team: a dashed line between that team's two players plus a filled circle at their midpoint. */
export function BlackHoleOverlay({ players, settings }: BlackHoleOverlayProps) {
  return (
    <g className="black-hole-overlay">
      {settings.showBlackHoleTeamA && <TeamBlackHole players={players} team="A" />}
      {settings.showBlackHoleTeamB && <TeamBlackHole players={players} team="B" />}
    </g>
  );
}
