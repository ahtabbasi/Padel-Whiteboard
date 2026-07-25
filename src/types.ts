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
}

export type EditorMode = 'move' | 'arrow';

export interface DisplaySettings {
  showBlackHoleTeamA: boolean;
  showBlackHoleTeamB: boolean;
  showNoManZone: boolean;
  showBorders: boolean;
  showHighPercentageZone: boolean;
  /** When enabled, both players on a team move by the same delta. */
  moveTogether: boolean;
}

/** Identifies which mini-app is currently active from the home launcher. */
export type AppId = 'strategist' | 'tournament';

export type TournamentPhase = 'setup' | 'tournament' | 'results';
export type TournamentSetupMode = 'manual' | 'random';

/** A padel pair competing in the round robin (distinct from the whiteboard's A/B `Team`). */
export interface TournamentTeam {
  id: string;
  name: string;
  p1: string;
  p2: string;
}

export interface TournamentMatch {
  id: string;
  round: number;
  teamA: string;
  teamB: string;
  /** Games won, stored as free-text digits while being edited. */
  gamesA: string;
  gamesB: string;
}

export interface TournamentStanding {
  id: string;
  name: string;
  played: number;
  wins: number;
  losses: number;
  gamesWon: number;
}

export interface TournamentState {
  phase: TournamentPhase;
  teams: TournamentTeam[];
  matches: TournamentMatch[];
}
