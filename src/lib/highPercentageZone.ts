import { NET_Y } from './courtGeometry';
import type { Point, Team } from '../types';

/**
 * High-percentage shot zone geometry. Team A plays from the bottom (back wall
 * at y = 1), team B from the top (back wall at y = 0).
 *
 * The zone is a triangle from the player to the full-width target line on the
 * opponent's half, plus a rectangle from that line to the opponent back wall.
 */
export function getHighPercentageTargetY(team: Team, playerPos: Point): number {
  const forwardMoved = team === 'A' ? 1 - playerPos.y : playerPos.y;
  return team === 'A' ? forwardMoved : 1 - forwardMoved;
}

export function getHighPercentageTargets(team: Team, playerPos: Point): [Point, Point] {
  const targetY = getHighPercentageTargetY(team, playerPos);
  return [{ x: 0, y: targetY }, { x: 1, y: targetY }];
}

/** Opponent back wall y for the high-percentage rectangle extension. */
export function getHighPercentageBackWallY(team: Team): number {
  return team === 'A' ? 0 : 1;
}

/** Full zone polygon: back-wall corners → target line → player. */
export function getHighPercentageZonePolygon(team: Team, playerPos: Point): Point[] {
  const targetY = getHighPercentageTargetY(team, playerPos);
  const backWallY = getHighPercentageBackWallY(team);
  return [
    { x: 0, y: backWallY },
    { x: 1, y: backWallY },
    { x: 1, y: targetY },
    playerPos,
    { x: 0, y: targetY },
  ];
}

/** Bisector from the player through the triangle base midpoint to the opponent back wall. */
export function getHighPercentageTriangleBisector(team: Team, playerPos: Point): [Point, Point] {
  const targetY = getHighPercentageTargetY(team, playerPos);
  const backWallY = getHighPercentageBackWallY(team);
  const midBase = { x: 0.5, y: targetY };

  const dy = midBase.y - playerPos.y;
  if (Math.abs(dy) < 1e-9) {
    return [playerPos, { x: 0.5, y: backWallY }];
  }

  const t = (backWallY - playerPos.y) / dy;
  const endX = playerPos.x + t * (midBase.x - playerPos.x);
  return [playerPos, { x: endX, y: backWallY }];
}

export function clampTargetY(team: Team, y: number): number {
  return team === 'A' ? Math.min(y, NET_Y) : Math.max(y, NET_Y);
}
