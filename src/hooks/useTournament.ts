import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { TournamentMatch, TournamentPhase, TournamentSetupMode, TournamentTeam } from '../types';
import { MIN_TEAMS, MAX_TEAMS, generateSchedule, makeDefaultTeams, nextTeamIdCounter, shuffleArray } from '../lib/tournament';
import { loadTournamentState, saveTournamentState } from '../lib/tournamentStorage';

function loadInitial(): { teams: TournamentTeam[]; matches: TournamentMatch[]; phase: TournamentPhase } {
  const saved = loadTournamentState();
  if (saved) return saved;
  return { teams: makeDefaultTeams(5, 0), matches: [], phase: 'setup' };
}

export function useTournament() {
  const initial = useRef(loadInitial()).current;
  const [phase, setPhase] = useState<TournamentPhase>(initial.phase);
  const [setupMode, setSetupMode] = useState<TournamentSetupMode>('manual');
  const [teams, setTeams] = useState<TournamentTeam[]>(initial.teams);
  const [players, setPlayers] = useState<string[]>(() =>
    Array(Math.max(initial.teams.length * 2, MIN_TEAMS * 2)).fill(''),
  );
  const [matches, setMatches] = useState<TournamentMatch[]>(initial.matches);
  const [activeRound, setActiveRound] = useState(1);
  const [showResetModal, setShowResetModal] = useState(false);
  const idCounterRef = useRef(nextTeamIdCounter(initial.teams));

  useEffect(() => {
    saveTournamentState({ teams, matches, phase });
  }, [teams, matches, phase]);

  const updateTeam = useCallback((idx: number, field: 'name' | 'p1' | 'p2', value: string) => {
    setTeams((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  }, []);

  const addTeam = useCallback(() => {
    setTeams((prev) => {
      if (prev.length >= MAX_TEAMS) return prev;
      const id = `t${idCounterRef.current++}`;
      return [...prev, { id, name: '', p1: '', p2: '' }];
    });
  }, []);

  const removeTeam = useCallback((idx: number) => {
    setTeams((prev) => {
      if (prev.length <= MIN_TEAMS) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const updatePlayer = useCallback((idx: number, value: string) => {
    setPlayers((prev) => prev.map((p, i) => (i === idx ? value : p)));
  }, []);

  const addPlayer = useCallback(() => {
    setPlayers((prev) => {
      if (prev.length >= MAX_TEAMS * 2) return prev;
      return [...prev, ''];
    });
  }, []);

  const removePlayer = useCallback((idx: number) => {
    setPlayers((prev) => {
      if (prev.length <= MIN_TEAMS * 2) return prev;
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const shuffleIntoTeams = useCallback(() => {
    const names = players.map((p) => p.trim()).filter(Boolean);
    if (names.length < MIN_TEAMS * 2) return;
    const shuffled = shuffleArray(names);
    const teamCount = Math.floor(shuffled.length / 2);
    const leftover = shuffled.slice(teamCount * 2);
    const newTeams: TournamentTeam[] = [];
    for (let i = 0; i < teamCount; i++) {
      newTeams.push({
        id: `t${idCounterRef.current++}`,
        name: '',
        p1: shuffled[i * 2],
        p2: shuffled[i * 2 + 1],
      });
    }
    if (leftover.length) {
      newTeams[newTeams.length - 1].p2 += ` & ${leftover[0]}`;
    }
    setTeams(newTeams);
    setSetupMode('manual');
  }, [players]);

  const startTournament = useCallback(() => {
    const namedTeams = teams.map((t, i) => ({ ...t, name: t.name.trim() || `Team ${i + 1}` }));
    setTeams(namedTeams);
    setMatches(generateSchedule(namedTeams.map((t) => t.id)));
    setActiveRound(1);
    setPhase('tournament');
  }, [teams]);

  const resetAll = useCallback(() => {
    const n = teams.length || 5;
    setTeams(makeDefaultTeams(n, idCounterRef.current));
    idCounterRef.current += n;
    setPlayers(Array(n * 2).fill(''));
    setMatches([]);
    setSetupMode('manual');
    setPhase('setup');
  }, [teams.length]);

  const handleResetClick = useCallback(() => setShowResetModal(true), []);
  const cancelReset = useCallback(() => setShowResetModal(false), []);
  const confirmReset = useCallback(() => {
    setShowResetModal(false);
    resetAll();
  }, [resetAll]);

  const updateMatchScore = useCallback((matchId: string, side: 'a' | 'b', value: string) => {
    const clean = value.replace(/[^0-9]/g, '').slice(0, 3);
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, [side === 'a' ? 'gamesA' : 'gamesB']: clean } : m)),
    );
  }, []);

  return {
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
  };
}
