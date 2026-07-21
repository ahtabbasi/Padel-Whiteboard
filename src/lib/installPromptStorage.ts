const STORAGE_KEY = 'padel-whiteboard:install-prompt:v1';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const MAX_DISMISS_COUNT = 3;

interface InstallPromptState {
  lastPromptAt: number;
  dismissCount: number;
}

function readState(): InstallPromptState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<InstallPromptState>;
    if (typeof parsed.lastPromptAt !== 'number' || typeof parsed.dismissCount !== 'number') {
      return null;
    }
    return { lastPromptAt: parsed.lastPromptAt, dismissCount: parsed.dismissCount };
  } catch {
    return null;
  }
}

function writeState(state: InstallPromptState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable: silently no-op.
  }
}

export function canShowAutoPrompt(): boolean {
  const state = readState();
  if (!state) return true;
  if (state.dismissCount >= MAX_DISMISS_COUNT) return false;
  return Date.now() - state.lastPromptAt >= TWENTY_FOUR_HOURS_MS;
}

export function recordPromptShown(): void {
  const state = readState();
  writeState({
    lastPromptAt: Date.now(),
    dismissCount: state?.dismissCount ?? 0,
  });
}

export function recordDismiss(): void {
  const state = readState();
  writeState({
    lastPromptAt: Date.now(),
    dismissCount: (state?.dismissCount ?? 0) + 1,
  });
}

export function resetInstallPromptState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable: silently no-op.
  }
}
