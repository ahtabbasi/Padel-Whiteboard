import type { Board } from '../types';
import { createNewBoard } from './courtGeometry';
import { normalizePlayer, type LegacyPlayer } from './normalizeBoard';

const STORAGE_KEY = 'padel-whiteboard:boards:v1';
const ACTIVE_BOARD_KEY = 'padel-whiteboard:active-board:v1';

function readAll(): Board[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(boards: Board[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch {
    // Storage unavailable/full: silently no-op.
  }
}

export function listBoards(): Board[] {
  return readAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getBoard(id: string): Board | undefined {
  return readAll().find((b) => b.id === id);
}

export function createBoard(name: string): Board {
  const board = createNewBoard(name);
  const boards = readAll();
  boards.push(board);
  writeAll(boards);
  setActiveBoardId(board.id);
  return board;
}

export function saveBoard(board: Board): void {
  const boards = readAll();
  const index = boards.findIndex((b) => b.id === board.id);
  if (index === -1) {
    boards.push(board);
  } else {
    boards[index] = board;
  }
  writeAll(boards);
  setActiveBoardId(board.id);
}

export function renameBoard(id: string, name: string): void {
  const boards = readAll();
  const board = boards.find((b) => b.id === id);
  if (!board) return;
  board.name = name;
  board.updatedAt = Date.now();
  writeAll(boards);
}

export function deleteBoard(id: string): void {
  const remaining = readAll().filter((b) => b.id !== id);
  writeAll(remaining);
  if (getActiveBoardId() === id) {
    if (remaining.length > 0) {
      setActiveBoardId(remaining.sort((a, b) => b.updatedAt - a.updatedAt)[0].id);
    } else {
      clearActiveBoardId();
    }
  }
}

export function duplicateBoard(id: string): Board | undefined {
  const boards = readAll();
  const source = boards.find((b) => b.id === id);
  if (!source) return undefined;
  const now = Date.now();
  const copy: Board = {
    ...source,
    id: crypto.randomUUID(),
    name: `${source.name} (copy)`,
    createdAt: now,
    updatedAt: now,
    players: source.players.map((p) => {
      const normalized = normalizePlayer(p as LegacyPlayer);
      return {
        ...normalized,
        pos: { ...normalized.pos },
        arrows: normalized.arrows.map((arrow) => ({
          id: crypto.randomUUID(),
          target: { ...arrow.target },
        })),
      };
    }),
  };
  boards.push(copy);
  writeAll(boards);
  return copy;
}

export function getActiveBoardId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_BOARD_KEY);
  } catch {
    return null;
  }
}

export function setActiveBoardId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_BOARD_KEY, id);
  } catch {
    // Storage unavailable: silently no-op.
  }
}

function clearActiveBoardId(): void {
  try {
    localStorage.removeItem(ACTIVE_BOARD_KEY);
  } catch {
    // Storage unavailable: silently no-op.
  }
}

/** Opens the last active board, the most recently edited board, or creates a new one. */
export function resolveInitialBoard(): Board {
  const activeId = getActiveBoardId();
  if (activeId) {
    const active = getBoard(activeId);
    if (active) return active;
  }
  const boards = listBoards();
  if (boards.length > 0) {
    setActiveBoardId(boards[0].id);
    return boards[0];
  }
  return createBoard('Board 1');
}
