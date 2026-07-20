import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { Board, Point } from '../types';
import { clamp01, createDefaultBall, createDefaultPlayers } from '../lib/courtGeometry';
import { saveBoard } from '../lib/storage';

const AUTOSAVE_DELAY_MS = 500;

export function useBoardEditor(initialBoard: Board) {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [saved, setSaved] = useState(true);
  const timeoutRef = useRef<number | undefined>(undefined);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaved(false);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      saveBoard(board);
      setSaved(true);
    }, AUTOSAVE_DELAY_MS);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [board]);

  const updateBoard = useCallback((updater: (b: Board) => Board) => {
    setBoard((prev) => ({ ...updater(prev), updatedAt: Date.now() }));
  }, []);

  const movePlayer = useCallback(
    (id: string, pos: Point) => {
      const clamped: Point = { x: clamp01(pos.x), y: clamp01(pos.y) };
      updateBoard((b) => ({
        ...b,
        players: b.players.map((p) => (p.id === id ? { ...p, pos: clamped } : p)),
      }));
    },
    [updateBoard],
  );

  const setArrow = useCallback(
    (id: string, target: Point) => {
      const clamped: Point = { x: clamp01(target.x), y: clamp01(target.y) };
      updateBoard((b) => ({
        ...b,
        players: b.players.map((p) => (p.id === id ? { ...p, arrowTarget: clamped } : p)),
      }));
    },
    [updateBoard],
  );

  const clearArrow = useCallback(
    (id: string) => {
      updateBoard((b) => ({
        ...b,
        players: b.players.map((p) => (p.id === id ? { ...p, arrowTarget: undefined } : p)),
      }));
    },
    [updateBoard],
  );

  const moveBall = useCallback(
    (pos: Point) => {
      const clamped: Point = { x: clamp01(pos.x), y: clamp01(pos.y) };
      updateBoard((b) => ({ ...b, ball: clamped }));
    },
    [updateBoard],
  );

  const resetPositions = useCallback(() => {
    updateBoard((b) => ({
      ...b,
      players: createDefaultPlayers(),
      ball: createDefaultBall(),
    }));
  }, [updateBoard]);

  return { board, movePlayer, setArrow, clearArrow, moveBall, resetPositions, saved };
}
