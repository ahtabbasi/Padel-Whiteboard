export type Team = 'A' | 'B';

/** Normalized coordinate, 0..1 on both axes relative to the court. */
export interface Point {
  x: number;
  y: number;
}

export interface PlayerToken {
  id: string;
  team: Team;
  pos: Point;
  /** At most one arrow per player. The arrow always starts at `pos`, so only the end point is stored. */
  arrowTarget?: Point;
}

export interface Board {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  /** Always exactly 4 tokens: 2 team A, 2 team B. */
  players: PlayerToken[];
  ball: Point;
}

export type EditorMode = 'move' | 'arrow';

export interface DisplaySettings {
  showBall: boolean;
  showBlackHoleTeamA: boolean;
  showBlackHoleTeamB: boolean;
  showAttackZone: boolean;
  showNoManZone: boolean;
  showDefenceZone: boolean;
  showBorders: boolean;
  showHighPercentageZone: boolean;
}
