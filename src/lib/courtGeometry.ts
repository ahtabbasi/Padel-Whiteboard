import type { Board, PlayerToken, Point } from '../types';

/**
 * All court geometry is expressed as normalized fractions (0..1) so it is
 * independent of screen size. `x` runs across the court width, `y` runs
 * along its length. The net sits at y = 0.5. Team A's back wall is at
 * y = 0, team B's back wall is at y = 1.
 *
 * The SVG viewBox below simply picks pixel dimensions matching the real
 * padel court ratio (20m long x 10m wide = 1:2) so lines/strokes look right;
 * it has no bearing on the normalized coordinates stored in a Board.
 */
export const COURT_VIEW_WIDTH = 400;
export const COURT_VIEW_HEIGHT = 800;

export const NET_Y = 0.5;

/** Real padel service line sits 3m from the net; the court is 20m long. */
const SERVICE_LINE_OFFSET = 3 / 20;
export const SERVICE_LINE_A_Y = NET_Y - SERVICE_LINE_OFFSET; // 0.35
export const SERVICE_LINE_B_Y = NET_Y + SERVICE_LINE_OFFSET; // 0.65

interface Band {
  y0: number;
  y1: number;
}

/** Attack / no-man / defence bands, split by distance from the net on each half. */
export function getZoneBands(): { attack: Band[]; noMan: Band[]; defence: Band[] } {
  const midwayA = SERVICE_LINE_A_Y / 2;
  const midwayB = SERVICE_LINE_B_Y + (1 - SERVICE_LINE_B_Y) / 2;
  return {
    attack: [
      { y0: SERVICE_LINE_A_Y, y1: NET_Y },
      { y0: NET_Y, y1: SERVICE_LINE_B_Y },
    ],
    noMan: [
      { y0: midwayA, y1: SERVICE_LINE_A_Y },
      { y0: SERVICE_LINE_B_Y, y1: midwayB },
    ],
    defence: [
      { y0: 0, y1: midwayA },
      { y0: midwayB, y1: 1 },
    ],
  };
}

/** Fraction of each side wall (measured from each back wall inward) that is glass vs. fence. */
export const SIDE_WALL_GLASS_END = 1 / 3;

function makePlayer(id: string, team: PlayerToken['team'], pos: Point): PlayerToken {
  return { id, team, pos };
}

export function createDefaultPlayers(): PlayerToken[] {
  return [
    makePlayer('p-a1', 'A', { x: 0.25, y: 0.4 }),
    makePlayer('p-a2', 'A', { x: 0.75, y: 0.4 }),
    makePlayer('p-b1', 'B', { x: 0.25, y: 0.6 }),
    makePlayer('p-b2', 'B', { x: 0.75, y: 0.6 }),
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
