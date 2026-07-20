import { NET_Y } from './courtGeometry';
import type { Point, Team } from '../types';

/**
 * High-percentage shot zone geometry. Team A plays from the bottom (back wall
 * at y = 1), team B from the top (back wall at y = 0).
 */
export function getHighPercentageTargets(team: Team, playerPos: Point): [Point, Point] {
  if (team === 'A') {
    const forwardMoved = 1 - playerPos.y;
    const targetY = forwardMoved;
    return [{ x: 0, y: targetY }, { x: 1, y: targetY }];
  }
  const forwardMoved = playerPos.y;
  const targetY = 1 - forwardMoved;
  return [{ x: 0, y: targetY }, { x: 1, y: targetY }];
}

export function clampTargetY(team: Team, y: number): number {
  return team === 'A' ? Math.min(y, NET_Y) : Math.max(y, NET_Y);
}
