import type { Board, PlayerToken, Point } from '../types';

/**
 * All court geometry is expressed as normalized fractions (0..1) so it is
 * independent of screen size. `x` runs across the court width, `y` runs
 * along its length. The net sits at y = 0.5. Team B's back wall is at
 * y = 0 (top), team A's back wall is at y = 1 (bottom).
 *
 * The SVG viewBox below simply picks pixel dimensions matching the real
 * padel court ratio (20m long x 10m wide = 1:2) so lines/strokes look right;
 * it has no bearing on the normalized coordinates stored in a Board.
 */
export const COURT_VIEW_WIDTH = 400;
export const COURT_VIEW_HEIGHT = 800;

export const NET_Y = 0.5;

/**
 * Zone math uses a linear axis from each back wall (0 m) to the net (10 m).
 * The full court length is 20 m, so each half spans 10 m in normalized y (0.5).
 */
export const COURT_LENGTH_M = 20;
export const COURT_WIDTH_M = 10;
export const HALF_COURT_LENGTH_M = COURT_LENGTH_M / 2;

/** Service line: 3 m from the back wall (defensive zone ends here). */
export const SERVICE_LINE_FROM_BACK_M = 3;
/** No-man's land ends and volley/attack zone begins at 6.95 m from the back wall. */
export const NO_MAN_ZONE_END_M = 6.95;

/** Normalized y for a distance in meters from the top (Team B) back wall. */
export function metersFromTopBackWallToY(meters: number): number {
  return meters / COURT_LENGTH_M;
}

/** Normalized y for a distance in meters from the bottom (Team A) back wall. */
export function metersFromBottomBackWallToY(meters: number): number {
  return 1 - meters / COURT_LENGTH_M;
}

/** Team B (top): back wall at y = 0. */
export const SERVICE_LINE_B_Y = metersFromTopBackWallToY(SERVICE_LINE_FROM_BACK_M);
/** Team A (bottom): back wall at y = 1. */
export const SERVICE_LINE_A_Y = metersFromBottomBackWallToY(SERVICE_LINE_FROM_BACK_M);

interface Band {
  y0: number;
  y1: number;
}

/**
 * No-man's land on each half: 3 m ≤ x < 6.95 m from the back wall
 * (service line through the transition zone toward the net).
 */
export function getNoManZoneBands(): Band[] {
  const noManEndYFromTop = metersFromTopBackWallToY(NO_MAN_ZONE_END_M);
  const noManEndYFromBottom = metersFromBottomBackWallToY(NO_MAN_ZONE_END_M);

  return [
    { y0: SERVICE_LINE_B_Y, y1: noManEndYFromTop },
    { y0: noManEndYFromBottom, y1: SERVICE_LINE_A_Y },
  ];
}

/** Fraction of each side wall (measured from each back wall inward) that is glass vs. fence. */
export const SIDE_WALL_GLASS_END = 1 / 3;

/** Standard panoramic padel court uses 18 glass panels (~2995×1995 mm). */
export const GLASS_PANEL_WIDTH_M = 1.995;
export const GLASS_PANEL_LENGTH_M = 2.995;
export const BACK_WALL_GLASS_PANEL_COUNT = 5;
export const GLASS_PANEL_GAP_M = 0.05;

function makePlayer(id: string, team: PlayerToken['team'], pos: Point): PlayerToken {
  return { id, team, pos, arrows: [] };
}

/** Midpoint between a team's back wall and their service line. */
function defaultYBetweenBackAndService(team: PlayerToken['team']): number {
  if (team === 'B') return SERVICE_LINE_B_Y / 2;
  return (SERVICE_LINE_A_Y + 1) / 2;
}

export function createDefaultPlayers(): PlayerToken[] {
  const sideInset = 0.25;
  return [
    makePlayer('p-b1', 'B', { x: sideInset, y: defaultYBetweenBackAndService('B') }),
    makePlayer('p-b2', 'B', { x: 1 - sideInset, y: defaultYBetweenBackAndService('B') }),
    makePlayer('p-a1', 'A', { x: sideInset, y: defaultYBetweenBackAndService('A') }),
    makePlayer('p-a2', 'A', { x: 1 - sideInset, y: defaultYBetweenBackAndService('A') }),
  ];
}

export function createDefaultBall(): Point {
  return { x: 0.5, y: 0.5 };
}

export function createNewBoard(name: string): Board {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    updatedAt: now,
    players: createDefaultPlayers(),
    ball: createDefaultBall(),
  };
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
