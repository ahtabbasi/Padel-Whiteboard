import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { Board, Point } from '../types';
import { clamp01, createDefaultBall, createDefaultPlayers } from '../lib/courtGeometry';
import { normalizeBoard } from '../lib/normalizeBoard';
import { saveBoard } from '../lib/storage';

const AUTOSAVE_DELAY_MS = 500;

export function useBoardEditor(initialBoard: Board) {
  const [board, setBoard] = useState<Board>(() => normalizeBoard(initialBoard));
  const timeoutRef = useRef<number | undefined>(undefined);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setBoard(normalizeBoard(initialBoard));
    isFirstRender.current = true;
  }, [initialBoard.id]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      saveBoard(board);
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

  const addArrow = useCallback(
    (id: string, target: Point) => {
      const clamped: Point = { x: clamp01(target.x), y: clamp01(target.y) };
      updateBoard((b) => ({
        ...b,
        players: b.players.map((p) =>
          p.id === id
            ? {
                ...p,
                arrows: [...p.arrows, { id: crypto.randomUUID(), target: clamped }],
              }
            : p,
        ),
      }));
    },
    [updateBoard],
  );

  const removeArrow = useCallback(
    (playerId: string, arrowId: string) => {
      updateBoard((b) => ({
        ...b,
        players: b.players.map((p) =>
          p.id === playerId ? { ...p, arrows: p.arrows.filter((arrow) => arrow.id !== arrowId) } : p,
        ),
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

  return { board, movePlayer, addArrow, removeArrow, moveBall, resetPositions };
}
