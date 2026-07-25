import type { TournamentMatch, TournamentTeam } from '../types';
import { matchResult } from '../lib/tournament';

interface TournamentMatchesProps {
  rounds: number[];
  completedRounds: Set<number>;
  activeRound: number;
  onActiveRoundChange: (round: number) => void;
  matches: TournamentMatch[];
  teamById: (id: string) => TournamentTeam | undefined;
  teamColor: (id: string) => string;
  updateScore: (matchId: string, side: 'a' | 'b', value: string) => void;
}

export function TournamentMatches({
  rounds,
  completedRounds,
  activeRound,
  onActiveRoundChange,
  matches,
  teamById,
  teamColor,
  updateScore,
}: TournamentMatchesProps) {
  return (
    <div>
      <div className="t-round-tabs">
        {rounds.map((r) => (
          <button
            key={r}
            type="button"
            className={`t-round-tab${activeRound === r ? ' t-round-tab-active' : ''}`}
            onClick={() => onActiveRoundChange(r)}
          >
            {completedRounds.has(r) && <CheckIcon />}
            Round {r}
          </button>
        ))}
      </div>

      {matches
        .filter((m) => m.round === activeRound)
        .map((m) => (
          <MatchCard
            key={m.id}
            match={m}
            teamA={teamById(m.teamA)}
            teamB={teamById(m.teamB)}
            colorA={teamColor(m.teamA)}
            colorB={teamColor(m.teamB)}
            updateScore={updateScore}
          />
        ))}
    </div>
  );
}

function MatchCard({
  match,
  teamA,
  teamB,
  colorA,
  colorB,
  updateScore,
}: {
  match: TournamentMatch;
  teamA: TournamentTeam | undefined;
  teamB: TournamentTeam | undefined;
  colorA: string;
  colorB: string;
  updateScore: (matchId: string, side: 'a' | 'b', value: string) => void;
}) {
  const result = matchResult(match);
  return (
    <div className="t-match-card">
      <div className="t-match-grid">
        <div className="t-match-teams">
          <TeamRow team={teamA} color={colorA} won={result.winner === 'a'} />
          <TeamRow team={teamB} color={colorB} won={result.winner === 'b'} />
        </div>
        <div className="t-match-scores">
          <ScoreInput value={match.gamesA} onChange={(v) => updateScore(match.id, 'a', v)} />
          <ScoreInput value={match.gamesB} onChange={(v) => updateScore(match.id, 'b', v)} />
        </div>
      </div>
    </div>
  );
}

function TeamRow({ team, color, won }: { team: TournamentTeam | undefined; color: string; won: boolean }) {
  return (
    <div className="t-team-row">
      <span className="t-team-indicator" style={{ background: color }} />
      <div className="t-team-row-text">
        <div className={`t-team-row-name${won ? ' t-team-row-name-won' : ''}`}>{team ? team.name : '—'}</div>
        <div className="t-team-row-players">{team ? `${team.p1} / ${team.p2}` : ''}</div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" className="t-round-check">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ScoreInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <input
      className="t-score-input"
      value={value}
      onInput={(e) => onChange(e.currentTarget.value)}
      inputMode="numeric"
    />
  );
}
