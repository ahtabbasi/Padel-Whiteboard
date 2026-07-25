import { useState } from 'preact/hooks';
import type { TournamentMatch, TournamentStanding, TournamentTeam } from '../types';
import { matchResult } from '../lib/tournament';

interface TournamentResultsProps {
  standings: TournamentStanding[];
  matches: TournamentMatch[];
  teamById: (id: string) => TournamentTeam | undefined;
  teamColor: (id: string) => string;
}

export function TournamentResults({ standings, matches, teamById, teamColor }: TournamentResultsProps) {
  const champion = standings[0];
  const runnerUp = standings[1];
  const third = standings[2];
  const anyPlayed = standings.some((s) => s.played > 0);

  return (
    <div>
      <div className="t-results-eyebrow">
        <span>{anyPlayed ? 'Standings so far' : 'No matches played yet'}</span>
      </div>
      <h1 className="t-title t-title-center">{champion && anyPlayed ? champion.name : 'Results'}</h1>
      {anyPlayed && (
        <p className="t-subtitle t-subtitle-center">
          Leading the round robin with {champion ? champion.gamesWon : 0} total games won.
        </p>
      )}

      {anyPlayed && (
        <div className="t-podium">
          <PodiumBlock place={2} team={runnerUp} color={teamColor(runnerUp ? runnerUp.id : '')} height={90} />
          <PodiumBlock place={1} team={champion} color={teamColor(champion ? champion.id : '')} height={120} />
          <PodiumBlock place={3} team={third} color={teamColor(third ? third.id : '')} height={70} />
        </div>
      )}

      <StandingsBoard standings={standings} />
      {anyPlayed && (
        <MatchHistoryList matches={matches} teamById={teamById} />
      )}
    </div>
  );
}

function StandingsBoard({ standings }: { standings: TournamentStanding[] }) {
  return (
    <div className="t-standings">
      <div className="t-standings-header">
        <TrophyIcon />
        <span>Standings</span>
      </div>
      <div className="t-standings-scroll">
        <table className="t-standings-table">
          <thead>
            <tr>
              <th className="t-th">#</th>
              <th className="t-th t-th-left">Team</th>
              <th className="t-th">P</th>
              <th className="t-th">W</th>
              <th className="t-th">L</th>
              <th className="t-th">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr key={s.id} className="t-tr">
                <td className="t-td">{i + 1}</td>
                <td className="t-td t-td-left">{s.name}</td>
                <td className="t-td">{s.played}</td>
                <td className="t-td">{s.wins}</td>
                <td className="t-td">{s.losses}</td>
                <td className="t-td t-td-points">{s.gamesWon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MatchHistoryList({
  matches,
  teamById,
}: {
  matches: TournamentMatch[];
  teamById: (id: string) => TournamentTeam | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);

  return (
    <div className="t-match-history">
      <button
        type="button"
        className={`t-match-history-header${expanded ? ' t-match-history-header-expanded' : ''}`}
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <MatchesIcon />
        <span>All matches</span>
        <ChevronIcon expanded={expanded} />
      </button>
      {expanded &&
        rounds.map((round) => (
          <div key={round} className="t-match-history-round">
            <div className="t-match-history-round-label">Round {round}</div>
            {matches
              .filter((m) => m.round === round)
              .map((match) => (
                <MatchHistoryRow
                  key={match.id}
                  match={match}
                  teamA={teamById(match.teamA)}
                  teamB={teamById(match.teamB)}
                />
              ))}
          </div>
        ))}
    </div>
  );
}

function MatchHistoryRow({
  match,
  teamA,
  teamB,
}: {
  match: TournamentMatch;
  teamA: TournamentTeam | undefined;
  teamB: TournamentTeam | undefined;
}) {
  const result = matchResult(match);
  const scoreLabel = result.played ? `${result.aGames} – ${result.bGames}` : '—';

  return (
    <div className="t-match-history-row">
      <div className="t-match-history-teams">
        <span className={`t-match-history-team${result.winner === 'a' ? ' t-match-history-team-won' : ''}`}>
          {teamA ? teamA.name : '—'}
        </span>
        <span className="t-match-history-vs">vs</span>
        <span className={`t-match-history-team${result.winner === 'b' ? ' t-match-history-team-won' : ''}`}>
          {teamB ? teamB.name : '—'}
        </span>
      </div>
      <span className={`t-match-history-score${result.played ? '' : ' t-match-history-score-pending'}`}>
        {scoreLabel}
      </span>
    </div>
  );
}

function MatchesIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="t-trophy-icon">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="10" y1="4" x2="10" y2="22" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={`t-match-history-chevron${expanded ? ' t-match-history-chevron-expanded' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PodiumBlock({
  place,
  team,
  color,
  height,
}: {
  place: 1 | 2 | 3;
  team: TournamentStanding | undefined;
  color: string;
  height: number;
}) {
  return (
    <div className="t-podium-block">
      <MedalIcon place={place} />
      <div className="t-podium-name">{team ? team.name : '—'}</div>
      <div
        className="t-podium-bar"
        style={{ height, background: team ? color : 'var(--t-border)' }}
      >
        <span className="t-podium-place">{place}</span>
      </div>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="t-trophy-icon">
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3" />
      <path d="M16 5h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </svg>
  );
}

function MedalIcon({ place }: { place: 1 | 2 | 3 }) {
  const color = place === 1 ? 'var(--t-accent)' : place === 2 ? '#C9D6D3' : '#E3A15B';
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="t-medal-icon">
      <circle cx="12" cy="15" r="6" />
      <path d="m9 9-3-6h4l2 4 2-4h4l-3 6" />
    </svg>
  );
}
