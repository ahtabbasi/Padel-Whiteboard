import { NET_Y } from './courtGeometry';
import type { Point, Team } from '../types';

/**
 * The "high percentage shot zone" for a player: a triangle from the player
 * to two target points on the opponent's side.
 *
 * At the player's own back wall, the targets are the opponent's two back
 * corners (the classic deep cross-court/down-the-line targets). As the
 * player advances toward the net, the targets slide from those back
 * corners toward the net line itself — by the time the player reaches the
 * net, the targets sit at the full width of the net line, meaning the
 * triangle sweeps the entire width of the opponent's court from close
 * range. Lateral player movement skews the triangle naturally since the
 * player is the apex.
 */
export function getHighPercentageTargets(team: Team, playerPos: Point): [Point, Point] {
  if (team === 'A') {
    const forwardMoved = playerPos.y; // 0 at own back wall, 0.5 at the net
    const targetY = 1 - forwardMoved;
    return [{ x: 0, y: targetY }, { x: 1, y: targetY }];
  }
  const forwardMoved = 1 - playerPos.y; // 0 at own back wall, 0.5 at the net
  const targetY = forwardMoved;
  return [{ x: 0, y: targetY }, { x: 1, y: targetY }];
}

/** Clamp so the highlighted targets never cross past the net into the player's own half. */
export function clampTargetY(team: Team, y: number): number {
  return team === 'A' ? Math.max(y, NET_Y) : Math.min(y, NET_Y);
}
