import type { ComponentChildren } from 'preact';
import type { TournamentSetupMode, TournamentTeam } from '../types';
import { MAX_TEAMS, MIN_TEAMS, teamColorAt } from '../lib/tournament';

interface TournamentSetupProps {
  setupMode: TournamentSetupMode;
  onSetupModeChange: (mode: TournamentSetupMode) => void;
  teams: TournamentTeam[];
  updateTeam: (idx: number, field: 'name' | 'p1' | 'p2', value: string) => void;
  onAddTeam: () => void;
  onRemoveTeam: (idx: number) => void;
  onStart: () => void;
  players: string[];
  updatePlayer: (idx: number, value: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (idx: number) => void;
  onShuffle: () => void;
}

function ModeTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ComponentChildren; label: string }) {
  return (
    <button type="button" className={`t-mode-tab${active ? ' t-mode-tab-active' : ''}`} onClick={onClick}>
      {icon}
      {label}
    </button>
  );
}

export function TournamentSetup({
  setupMode,
  onSetupModeChange,
  teams,
  updateTeam,
  onAddTeam,
  onRemoveTeam,
  onStart,
  players,
  updatePlayer,
  onAddPlayer,
  onRemovePlayer,
  onShuffle,
}: TournamentSetupProps) {
  return (
    <>
      <div className="t-mode-tabs">
        <ModeTab
          active={setupMode === 'manual'}
          onClick={() => onSetupModeChange('manual')}
          icon={<UsersIcon />}
          label="Assign teams"
        />
        <ModeTab
          active={setupMode === 'random'}
          onClick={() => onSetupModeChange('random')}
          icon={<ShuffleIcon />}
          label="Random shuffle"
        />
      </div>

      {setupMode === 'manual' ? (
        <ManualSetup teams={teams} updateTeam={updateTeam} onAdd={onAddTeam} onRemove={onRemoveTeam} onStart={onStart} />
      ) : (
        <RandomSetup
          players={players}
          updatePlayer={updatePlayer}
          onAdd={onAddPlayer}
          onRemove={onRemovePlayer}
          onShuffle={onShuffle}
        />
      )}
    </>
  );
}

function ManualSetup({
  teams,
  updateTeam,
  onAdd,
  onRemove,
  onStart,
}: {
  teams: TournamentTeam[];
  updateTeam: (idx: number, field: 'name' | 'p1' | 'p2', value: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onStart: () => void;
}) {
  const allFilled = teams.every((t) => t.p1.trim() && t.p2.trim());
  return (
    <div>
      <div className="t-team-list">
        {teams.map((t, i) => (
          <div key={t.id} className="t-team-card">
            <div className="t-team-badge" style={{ background: teamColorAt(i) }}>
              {i + 1}
            </div>
            <div className="t-team-fields">
              <input
                className="t-input"
                placeholder={`Team ${i + 1} name (optional)`}
                value={t.name}
                onInput={(e) => updateTeam(i, 'name', e.currentTarget.value)}
              />
              <div className="t-team-players">
                <input
                  className="t-input"
                  placeholder="Player 1"
                  value={t.p1}
                  onInput={(e) => updateTeam(i, 'p1', e.currentTarget.value)}
                />
                <input
                  className="t-input"
                  placeholder="Player 2"
                  value={t.p2}
                  onInput={(e) => updateTeam(i, 'p2', e.currentTarget.value)}
                />
              </div>
            </div>
            <button
              type="button"
              className="t-icon-button"
              onClick={() => onRemove(i)}
              disabled={teams.length <= MIN_TEAMS}
              title={teams.length <= MIN_TEAMS ? `Minimum ${MIN_TEAMS} teams` : 'Remove team'}
              aria-label="Remove team"
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="t-dashed-button" onClick={onAdd} disabled={teams.length >= MAX_TEAMS}>
        <PlusIcon />
        Add team
      </button>

      <button type="button" className="t-primary-button" onClick={onStart} disabled={!allFilled}>
        Generate schedule
        <ChevronRightIcon />
      </button>
      {!allFilled && <p className="t-hint">Fill in both players for every team to continue.</p>}
    </div>
  );
}

function RandomSetup({
  players,
  updatePlayer,
  onAdd,
  onRemove,
  onShuffle,
}: {
  players: string[];
  updatePlayer: (idx: number, value: string) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onShuffle: () => void;
}) {
  const filledCount = players.map((p) => p.trim()).filter(Boolean).length;
  const teamCount = Math.floor(filledCount / 2);
  const canShuffle = filledCount >= MIN_TEAMS * 2;
  return (
    <div>
      <p className="t-copy">
        Add everyone playing tonight, then shuffle — we'll randomly pair players into teams of two.
      </p>
      <div className="t-player-grid">
        {players.map((p, i) => (
          <div key={i} className="t-player-row">
            <input
              className="t-input"
              placeholder={`Player ${i + 1}`}
              value={p}
              onInput={(e) => updatePlayer(i, e.currentTarget.value)}
            />
            <button
              type="button"
              className="t-icon-button t-icon-button-bordered"
              onClick={() => onRemove(i)}
              disabled={players.length <= MIN_TEAMS * 2}
              aria-label="Remove player"
            >
              <XIcon size={14} />
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="t-dashed-button" onClick={onAdd} disabled={players.length >= MAX_TEAMS * 2}>
        <PlusIcon />
        Add player
      </button>

      <p className="t-mono-hint">
        {filledCount} named · {teamCount} teams
        {filledCount % 2 !== 0 ? ' (1 player left over)' : ''}
      </p>

      <button type="button" className="t-primary-button" onClick={onShuffle} disabled={!canShuffle}>
        <ShuffleIcon />
        Shuffle into teams
      </button>
      {!canShuffle && <p className="t-hint">Name at least {MIN_TEAMS * 2} players to shuffle.</p>}
    </div>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
