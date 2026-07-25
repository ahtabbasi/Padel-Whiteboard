import { useTournament } from '../hooks/useTournament';
import { computeStandings, isRoundComplete, matchResult, teamColorAt } from '../lib/tournament';
import { TournamentSetup } from './TournamentSetup';
import { TournamentMatches } from './TournamentMatches';
import { TournamentResults } from './TournamentResults';
import { TournamentResetModal } from './TournamentResetModal';

interface TournamentAppProps {
  onHome: () => void;
}

export function TournamentApp({ onHome }: TournamentAppProps) {
  const {
    phase,
    setPhase,
    setupMode,
    setSetupMode,
    teams,
    players,
    matches,
    activeRound,
    setActiveRound,
    showResetModal,
    updateTeam,
    addTeam,
    removeTeam,
    updatePlayer,
    addPlayer,
    removePlayer,
    shuffleIntoTeams,
    startTournament,
    handleResetClick,
    cancelReset,
    confirmReset,
    updateMatchScore,
  } = useTournament();

  const teamById = (id: string) => teams.find((t) => t.id === id);
  const teamColor = (id: string) => teamColorAt(teams.findIndex((t) => t.id === id));

  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);
  const completedRounds = new Set(rounds.filter((r) => isRoundComplete(matches, r)));
  const allRoundsComplete = rounds.length > 0 && rounds.every((r) => isRoundComplete(matches, r));
  const standings = phase === 'tournament' || phase === 'results' ? computeStandings(teams, matches) : [];
  const totalMatches = matches.length;
  const playedMatches = matches.filter((m) => matchResult(m).played).length;

  return (
    <div className="tournament-app">
      <div className="t-shell">
        <header className="t-header">
          <div className="t-brand">
            <button type="button" className="t-home-button" onClick={onHome} aria-label="Back to home">
              <HomeIcon />
            </button>
            <span className="t-brand-dot" />
            <span className="t-brand-label">Padel Night</span>
          </div>
          {(phase === 'tournament' || phase === 'results') && (
            <div className="t-header-actions">
              <button
                type="button"
                className={`t-ghost-button${phase === 'tournament' && allRoundsComplete ? ' t-ghost-button-highlight' : ''}`}
                onClick={() => setPhase(phase === 'results' ? 'tournament' : 'results')}
                title={phase === 'results' ? 'Back to schedule' : 'View results'}
              >
                {phase === 'results' ? (
                  <>
                    <ChevronLeftIcon />
                    Schedule
                  </>
                ) : (
                  <>
                    <TrophyIcon />
                    Results
                  </>
                )}
              </button>
              <button type="button" className="t-ghost-button" onClick={handleResetClick}>
                <ResetIcon />
                Reset
              </button>
            </div>
          )}
        </header>

        {phase !== 'results' && (
          <>
            <h1 className="t-title">Round Robin</h1>
            <p className="t-subtitle">
              {phase === 'setup'
                ? 'Set up your teams — everyone plays every other team once.'
                : `${playedMatches} of ${totalMatches} matches played`}
            </p>
          </>
        )}

        {phase === 'setup' && (
          <TournamentSetup
            setupMode={setupMode}
            onSetupModeChange={setSetupMode}
            teams={teams}
            updateTeam={updateTeam}
            onAddTeam={addTeam}
            onRemoveTeam={removeTeam}
            onStart={startTournament}
            players={players}
            updatePlayer={updatePlayer}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
            onShuffle={shuffleIntoTeams}
          />
        )}

        {phase === 'tournament' && (
          <TournamentMatches
            rounds={rounds}
            completedRounds={completedRounds}
            activeRound={activeRound}
            onActiveRoundChange={setActiveRound}
            matches={matches}
            teamById={teamById}
            teamColor={teamColor}
            updateScore={updateMatchScore}
          />
        )}

        {phase === 'results' && (
          <TournamentResults
            standings={standings}
            matches={matches}
            teamById={teamById}
            teamColor={teamColor}
          />
        )}
      </div>

      {showResetModal && <TournamentResetModal onCancel={cancelReset} onConfirm={confirmReset} />}
    </div>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5a1 1 0 0 0-1 1v1a3 3 0 0 0 3 3" />
      <path d="M16 5h3a1 1 0 0 1 1 1v1a3 3 0 0 1-3 3" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="16" x2="12" y2="20" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
