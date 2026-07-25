import type { TournamentState } from '../types';

const STORAGE_KEY = 'padel-whiteboard:tournament:v1';

export function loadTournamentState(): TournamentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.teams) || !Array.isArray(parsed.matches)) return null;
    return parsed as TournamentState;
  } catch {
    return null;
  }
}

export function saveTournamentState(state: TournamentState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable/full: silently no-op.
  }
}

export function clearTournamentState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable: silently no-op.
  }
}
