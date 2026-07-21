import type { Board } from '../types';
import { useBoards } from '../hooks/useBoards';
import { listBoards, setActiveBoardId } from '../lib/storage';

interface SideMenuProps {
  open: boolean;
  boards: Board[];
  activeBoardId: string;
  showInstallOption?: boolean;
  onInstall?: () => void;
  onClose: () => void;
  onSelect: (board: Board) => void;
  onCreate: () => void;
  onRename: (board: Board) => void;
  onDuplicate: (board: Board) => void;
  onDelete: (board: Board) => void;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function SideMenu({
  open,
  boards,
  activeBoardId,
  showInstallOption = false,
  onInstall,
  onClose,
  onSelect,
  onCreate,
  onRename,
  onDuplicate,
  onDelete,
}: SideMenuProps) {
  if (!open) return null;

  return (
    <div className="side-menu-backdrop" onClick={onClose}>
      <aside className="side-menu" onClick={(e) => e.stopPropagation()}>
        <header className="side-menu-header">
          <h2>Boards</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </header>

        <button type="button" className="new-board-button" onClick={onCreate}>
          + New board
        </button>

        {showInstallOption && onInstall && (
          <button type="button" className="install-app-button" onClick={onInstall}>
            Add to Home Screen
          </button>
        )}

        {boards.length === 0 ? (
          <p className="side-menu-empty">No saved boards yet.</p>
        ) : (
          <ul className="board-list">
            {boards.map((board) => (
              <li key={board.id} className={`board-list-item${board.id === activeBoardId ? ' board-list-item-active' : ''}`}>
                <button
                  type="button"
                  className="board-list-open"
                  onClick={() => {
                    setActiveBoardId(board.id);
                    onSelect(board);
                    onClose();
                  }}
                >
                  <span className="board-list-name">{board.name}</span>
                  <span className="board-list-date">Edited {formatDate(board.updatedAt)}</span>
                </button>
                <div className="board-list-actions">
                  <button type="button" className="icon-button" onClick={() => onRename(board)} aria-label="Rename">
                    ✎
                  </button>
                  <button type="button" className="icon-button" onClick={() => onDuplicate(board)} aria-label="Duplicate">
                    ⧉
                  </button>
                  <button type="button" className="icon-button" onClick={() => onDelete(board)} aria-label="Delete">
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

export function useSideMenuActions(onSelectBoard: (board: Board) => void) {
  const { boards, create, rename, remove, duplicate, refresh } = useBoards();

  const handleCreate = () => {
    const name = window.prompt('Name this board', `Board ${boards.length + 1}`);
    if (!name) return;
    const board = create(name.trim() || `Board ${boards.length + 1}`);
    onSelectBoard(board);
  };

  const handleRename = (board: Board) => {
    const name = window.prompt('Rename board', board.name);
    if (!name || !name.trim()) return;
    rename(board.id, name.trim());
    refresh();
  };

  const handleDelete = (board: Board) => {
    if (!window.confirm(`Delete "${board.name}"? This cannot be undone.`)) return;
    remove(board.id);
    refresh();
    const remaining = listBoards();
    if (remaining.length > 0) {
      onSelectBoard(remaining[0]);
    } else {
      onSelectBoard(create('Board 1'));
    }
  };

  const handleDuplicate = (board: Board) => {
    duplicate(board.id);
    refresh();
  };

  return { boards, handleCreate, handleRename, handleDelete, handleDuplicate, refresh };
}
