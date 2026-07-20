import type { DisplaySettings } from '../types';

const SETTINGS_KEY = 'padel-whiteboard:settings:v1';

export const DEFAULT_SETTINGS: DisplaySettings = {
  showBall: true,
  showBlackHoleTeamA: false,
  showBlackHoleTeamB: false,
  showNoManZone: false,
  showBorders: true,
  showHighPercentageZone: false,
};

export function loadSettings(): DisplaySettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: DisplaySettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Storage unavailable: silently no-op.
  }
}
