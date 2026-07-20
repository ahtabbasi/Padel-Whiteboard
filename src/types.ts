export type Team = 'A' | 'B';

/** Normalized coordinate, 0..1 on both axes relative to the court. */
export interface Point {
  x: number;
  y: number;
}

export interface PlayerArrow {
  id: string;
  target: Point;
}

export interface PlayerToken {
  id: string;
  team: Team;
  pos: Point;
  /** Movement arrows from this player. Each starts at the player's current position. */
  arrows: PlayerArrow[];
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
