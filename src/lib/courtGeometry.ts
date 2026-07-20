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

/** Real padel service line sits 3m from the back wall; the court is 20m long. */
const SERVICE_LINE_FROM_BACK = 3 / 20;
/** Team B (top): back wall at y = 0. */
export const SERVICE_LINE_B_Y = SERVICE_LINE_FROM_BACK;
/** Team A (bottom): back wall at y = 1. */
export const SERVICE_LINE_A_Y = 1 - SERVICE_LINE_FROM_BACK;

interface Band {
  y0: number;
  y1: number;
}

/** Attack / no-man / defence bands on each half, anchored to back-wall service lines. */
export function getZoneBands(): { attack: Band[]; noMan: Band[]; defence: Band[] } {
  const midwayB = SERVICE_LINE_B_Y / 2;
  const midwayA = SERVICE_LINE_A_Y + (1 - SERVICE_LINE_A_Y) / 2;
  return {
    attack: [
      { y0: SERVICE_LINE_B_Y, y1: NET_Y },
      { y0: NET_Y, y1: SERVICE_LINE_A_Y },
    ],
    noMan: [
      { y0: midwayB, y1: SERVICE_LINE_B_Y },
      { y0: SERVICE_LINE_A_Y, y1: midwayA },
    ],
    defence: [
      { y0: 0, y1: midwayB },
      { y0: midwayA, y1: 1 },
    ],
  };
}

/** Fraction of each side wall (measured from each back wall inward) that is glass vs. fence. */
export const SIDE_WALL_GLASS_END = 1 / 3;

function makePlayer(id: string, team: PlayerToken['team'], pos: Point): PlayerToken {
  return { id, team, pos };
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
