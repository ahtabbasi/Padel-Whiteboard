import type { AppId } from '../types';

const ACTIVE_APP_KEY = 'padel-whiteboard:active-app:v1';

export function getActiveApp(): AppId | null {
  try {
    const value = localStorage.getItem(ACTIVE_APP_KEY);
    return value === 'strategist' || value === 'tournament' ? value : null;
  } catch {
    return null;
  }
}

export function setActiveApp(appId: AppId): void {
  try {
    localStorage.setItem(ACTIVE_APP_KEY, appId);
  } catch {
    // Storage unavailable: silently no-op.
  }
}

export function clearActiveApp(): void {
  try {
    localStorage.removeItem(ACTIVE_APP_KEY);
  } catch {
    // Storage unavailable: silently no-op.
  }
}
