import type { Board } from '../types';
import { useBoards } from '../hooks/useBoards';

interface BoardLibraryProps {
  onOpen: (board: Board) => void;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function BoardLibrary({ onOpen }: BoardLibraryProps) {
  const { boards, create, rename, remove, duplicate } = useBoards();

  const handleCreate = () => {
    const name = window.prompt('Name this board', `Board ${boards.length + 1}`);
    if (!name) return;
    const board = create(name.trim() || `Board ${boards.length + 1}`);
    onOpen(board);
  };

  const handleRename = (board: Board) => {
    const name = window.prompt('Rename board', board.name);
    if (!name || !name.trim()) return;
    rename(board.id, name.trim());
  };

  const handleDelete = (board: Board) => {
    if (window.confirm(`Delete "${board.name}"? This cannot be undone.`)) {
      remove(board.id);
    }
  };

  const handleDuplicate = (board: Board) => {
    duplicate(board.id);
  };

  return (
    <div className="board-library">
      <header className="library-header">
        <h1>Padel Whiteboard</h1>
      </header>

      {boards.length === 0 ? (
        <div className="empty-state">
          <p>No boards yet. Create your first tactics board to get started.</p>
        </div>
      ) : (
        <ul className="board-list">
          {boards.map((board) => (
            <li key={board.id} className="board-list-item">
              <button type="button" className="board-list-open" onClick={() => onOpen(board)}>
                <span className="board-list-name">{board.name}</span>
                <span className="board-list-date">Edited {formatDate(board.updatedAt)}</span>
              </button>
              <div className="board-list-actions">
                <button type="button" className="icon-button" onClick={() => handleRename(board)} aria-label="Rename">
                  ✎
                </button>
                <button type="button" className="icon-button" onClick={() => handleDuplicate(board)} aria-label="Duplicate">
                  ⧉
                </button>
                <button type="button" className="icon-button" onClick={() => handleDelete(board)} aria-label="Delete">
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button type="button" className="new-board-button" onClick={handleCreate}>
        + New board
      </button>
    </div>
  );
}
