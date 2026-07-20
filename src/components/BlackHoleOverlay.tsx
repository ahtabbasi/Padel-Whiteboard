import { COURT_VIEW_HEIGHT, COURT_VIEW_WIDTH } from '../lib/courtGeometry';
import { toPxX, toPxY } from '../lib/svgCoords';
import type { DisplaySettings, PlayerToken } from '../types';

interface BlackHoleOverlayProps {
  players: PlayerToken[];
  settings: DisplaySettings;
}

/** One-third of the court width in pixel space. */
const MIN_SAFE_DISTANCE = COURT_VIEW_WIDTH / 3;
const BLACK_HOLE_HEIGHT = 8;

function distanceBetweenPlayersPx(p1: PlayerToken, p2: PlayerToken): number {
  const dx = (p2.pos.x - p1.pos.x) * COURT_VIEW_WIDTH;
  const dy = (p2.pos.y - p1.pos.y) * COURT_VIEW_HEIGHT;
  return Math.hypot(dx, dy);
}

function TeamBlackHole({ players, team }: { players: PlayerToken[]; team: 'A' | 'B' }) {
  const teamPlayers = players.filter((p) => p.team === team);
  if (teamPlayers.length < 2) return null;
  const [p1, p2] = teamPlayers;

  const x1 = toPxX(p1.pos.x);
  const y1 = toPxY(p1.pos.y);
  const x2 = toPxX(p2.pos.x);
  const y2 = toPxY(p2.pos.y);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const dist = distanceBetweenPlayersPx(p1, p2);
  const rx = Math.max(0, (dist - MIN_SAFE_DISTANCE) / 2);
  const angleDeg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

  return (
    <g className={`black-hole black-hole-${team}`}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className="black-hole-line" />
      {rx > 0 && (
        <ellipse
          cx={midX}
          cy={midY}
          rx={rx}
          ry={BLACK_HOLE_HEIGHT}
          transform={`rotate(${angleDeg} ${midX} ${midY})`}
          className="black-hole-ellipse"
        />
      )}
    </g>
  );
}

/** Per team: dashed line between players plus a dynamic ellipse at their midpoint. */
export function BlackHoleOverlay({ players, settings }: BlackHoleOverlayProps) {
  return (
    <g className="black-hole-overlay">
      {settings.showBlackHoleTeamA && <TeamBlackHole players={players} team="A" />}
      {settings.showBlackHoleTeamB && <TeamBlackHole players={players} team="B" />}
    </g>
  );
}
