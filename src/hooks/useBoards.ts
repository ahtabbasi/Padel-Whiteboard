import { useCallback, useState } from 'preact/hooks';
import type { Board } from '../types';
import * as storage from '../lib/storage';

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>(() => storage.listBoards());

  const refresh = useCallback(() => {
    setBoards(storage.listBoards());
  }, []);

  const create = useCallback((name: string) => {
    const board = storage.createBoard(name);
    refresh();
    return board;
  }, [refresh]);

  const rename = useCallback((id: string, name: string) => {
    storage.renameBoard(id, name);
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string) => {
    storage.deleteBoard(id);
    refresh();
  }, [refresh]);

  const duplicate = useCallback((id: string) => {
    const copy = storage.duplicateBoard(id);
    refresh();
    return copy;
  }, [refresh]);

  return { boards, create, rename, remove, duplicate, refresh };
}
