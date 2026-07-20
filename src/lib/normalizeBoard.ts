import type { Board, PlayerToken } from '../types';

export type LegacyPlayer = PlayerToken & { arrowTarget?: { x: number; y: number } };

/** Migrates saved boards that used a single optional `arrowTarget` per player. */
export function normalizePlayer(player: LegacyPlayer): PlayerToken {
  if (Array.isArray(player.arrows)) {
    return {
      ...player,
      arrows: player.arrows.map((arrow) => ({
        id: arrow.id,
        target: { ...arrow.target },
      })),
    };
  }

  const arrows = player.arrowTarget
    ? [{ id: crypto.randomUUID(), target: { ...player.arrowTarget } }]
    : [];

  const { arrowTarget: _removed, ...rest } = player;
  return { ...rest, arrows };
}

export function normalizeBoard(board: Board): Board {
  return {
    ...board,
    players: board.players.map((player) => normalizePlayer(player as LegacyPlayer)),
    ball: { ...board.ball },
  };
}
