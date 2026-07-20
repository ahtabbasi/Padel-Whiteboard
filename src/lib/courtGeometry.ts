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

/** Side-wall stack in BordersOverlay: 2 glass → 6 fence → 2 glass (per half). */
export const SIDE_WALL_GLASS_PANEL_COUNT = 2;
export const SIDE_WALL_FENCE_PANEL_COUNT = 6;
/** Gap between adjacent border panels in the SVG overlay (px). */
export const BORDER_PANEL_GAP_PX = 3;

export interface SidePanelLayout {
  panelSizePx: number;
  glassBlockDepthPx: number;
  fenceStartPx: number;
  /** Distance from a back wall to the inner edge of the first fence panel (px). */
  firstFenceEndPx: number;
}

/** Evenly distributes side-wall panels (2 glass + 6 fence + 2 glass) along the court length. */
export function layoutSidePanels(): SidePanelLayout {
  const sidePanelCount = SIDE_WALL_GLASS_PANEL_COUNT * 2 + SIDE_WALL_FENCE_PANEL_COUNT;
  const panelSizePx =
    (COURT_VIEW_HEIGHT - (sidePanelCount - 1) * BORDER_PANEL_GAP_PX) / sidePanelCount;
  const glassBlockDepthPx = SIDE_WALL_GLASS_PANEL_COUNT * panelSizePx + BORDER_PANEL_GAP_PX;
  const fenceStartPx = glassBlockDepthPx + BORDER_PANEL_GAP_PX;
  const firstFenceEndPx = fenceStartPx + panelSizePx;
  return { panelSizePx, glassBlockDepthPx, fenceStartPx, firstFenceEndPx };
}

/** Normalized y at the inner edge of the first fence panel (Team B / top back wall). */
export function firstFenceEndYFromTopBackWall(): number {
  return layoutSidePanels().firstFenceEndPx / COURT_VIEW_HEIGHT;
}

/** Normalized y at the inner edge of the first fence panel (Team A / bottom back wall). */
export function firstFenceEndYFromBottomBackWall(): number {
  return 1 - layoutSidePanels().firstFenceEndPx / COURT_VIEW_HEIGHT;
}

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
 * No-man's land on each half: from the service line (3 m from the back wall)
 * to the inner edge of the first side-wall fence panel (same layout as BordersOverlay).
 */
export function getNoManZoneBands(): Band[] {
  return [
    { y0: SERVICE_LINE_B_Y, y1: firstFenceEndYFromTopBackWall() },
    { y0: firstFenceEndYFromBottomBackWall(), y1: SERVICE_LINE_A_Y },
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

/** Constrain a movement delta so two points moving together stay within [0,1]². */
export function constrainMovementDelta(posA: Point, posB: Point, delta: Point): Point {
  const minDx = Math.max(-posA.x, -posB.x);
  const maxDx = Math.min(1 - posA.x, 1 - posB.x);
  const minDy = Math.max(-posA.y, -posB.y);
  const maxDy = Math.min(1 - posA.y, 1 - posB.y);
  return {
    x: Math.min(maxDx, Math.max(minDx, delta.x)),
    y: Math.min(maxDy, Math.max(minDy, delta.y)),
  };
}
