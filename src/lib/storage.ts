import type { Board } from '../types';
import { createNewBoard } from './courtGeometry';

const STORAGE_KEY = 'padel-whiteboard:boards:v1';

function readAll(): Board[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt or inaccessible storage: start fresh rather than crash the app.
    return [];
  }
}

function writeAll(boards: Board[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
  } catch {
    // Storage unavailable/full: silently no-op, nothing else we can do client-side only.
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
  writeAll(readAll().filter((b) => b.id !== id));
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
    players: source.players.map((p) => ({ ...p, pos: { ...p.pos }, arrowTarget: p.arrowTarget ? { ...p.arrowTarget } : undefined })),
    ball: { ...source.ball },
  };
  boards.push(copy);
  writeAll(boards);
  return copy;
}
