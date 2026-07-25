import type { TournamentMatch, TournamentStanding, TournamentTeam } from '../types';

export const MIN_TEAMS = 3;
export const MAX_TEAMS = 16;

export const TEAM_COLORS = [
  '#D4F04F',
  '#F2994A',
  '#5BC0EB',
  '#F45B69',
  '#9B8AFB',
  '#5FE1B0',
  '#F4C95D',
  '#E37BB0',
  '#7EC8E3',
  '#C77DFF',
  '#FF8F6B',
  '#84DCC6',
];

export function teamColorAt(index: number): string {
  return TEAM_COLORS[index % TEAM_COLORS.length];
}

export function makeDefaultTeams(count: number, startId: number): TournamentTeam[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `t${startId + i}`,
    name: '',
    p1: '',
    p2: '',
  }));
}

/** Finds the smallest unused numeric suffix so newly created team ids never collide. */
export function nextTeamIdCounter(teams: TournamentTeam[]): number {
  let max = -1;
  for (const team of teams) {
    const match = /^t(\d+)$/.exec(team.id);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  return max + 1;
}

/** Generates a round-robin schedule using the circle method; every team plays every other team once. */
export function generateSchedule(teamIds: string[]): TournamentMatch[] {
  const ids: (string | null)[] = [...teamIds];
  const hasBye = ids.length % 2 !== 0;
  if (hasBye) ids.push(null);
  const n = ids.length;
  const rounds: { teamA: string; teamB: string }[][] = [];
  let arr = [...ids];
  for (let r = 0; r < n - 1; r++) {
    const roundMatches: { teamA: string; teamB: string }[] = [];
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (a !== null && b !== null) {
        roundMatches.push({ teamA: a, teamB: b });
      }
    }
    rounds.push(roundMatches);
    const fixed = arr[0];
    const rest = arr.slice(1);
    const last = rest.pop();
    if (last !== undefined) rest.unshift(last);
    arr = [fixed, ...rest];
  }
  let matchId = 0;
  const matches: TournamentMatch[] = [];
  rounds.forEach((roundMatches, roundIndex) => {
    roundMatches.forEach((m) => {
      matches.push({
        id: `m${matchId++}`,
        round: roundIndex + 1,
        teamA: m.teamA,
        teamB: m.teamB,
        gamesA: '',
        gamesB: '',
      });
    });
  });
  return matches;
}

export interface MatchResult {
  aGames: number;
  bGames: number;
  winner: 'a' | 'b' | null;
  /** True once both scores have been entered, even if the games are tied. */
  played: boolean;
}

export function matchResult(match: TournamentMatch): MatchResult {
  const a = parseInt(match.gamesA, 10);
  const b = parseInt(match.gamesB, 10);
  const played = !isNaN(a) && !isNaN(b);
  const aGames = isNaN(a) ? 0 : a;
  const bGames = isNaN(b) ? 0 : b;
  const winner = played && a !== b ? (a > b ? 'a' : 'b') : null;
  return { aGames, bGames, winner, played };
}

/** A round counts as complete once every match in it has scores entered (ties included). */
export function isRoundComplete(matches: TournamentMatch[], round: number): boolean {
  const roundMatches = matches.filter((m) => m.round === round);
  return roundMatches.length > 0 && roundMatches.every((m) => matchResult(m).played);
}

export function computeStandings(teams: TournamentTeam[], matches: TournamentMatch[]): TournamentStanding[] {
  const table = new Map<string, TournamentStanding>();
  teams.forEach((t) => {
    table.set(t.id, { id: t.id, name: t.name, played: 0, wins: 0, losses: 0, gamesWon: 0 });
  });
  matches.forEach((m) => {
    const result = matchResult(m);
    if (!result.played) return;
    const a = table.get(m.teamA);
    const b = table.get(m.teamB);
    if (!a || !b) return;
    a.played++;
    b.played++;
    a.gamesWon += result.aGames;
    b.gamesWon += result.bGames;
    if (result.winner === 'a') {
      a.wins++;
      b.losses++;
    } else if (result.winner === 'b') {
      b.wins++;
      a.losses++;
    }
  });
  return Array.from(table.values()).sort((x, y) => {
    if (y.gamesWon !== x.gamesWon) return y.gamesWon - x.gamesWon;
    return y.wins - x.wins;
  });
}

export function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
