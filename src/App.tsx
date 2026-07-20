import { useState } from 'preact/hooks';
import type { Board } from './types';
import { BoardEditor } from './components/BoardEditor';
import { resolveInitialBoard } from './lib/storage';

export function App() {
  const [activeBoard, setActiveBoard] = useState<Board>(() => resolveInitialBoard());

  return <BoardEditor key={activeBoard.id} initialBoard={activeBoard} onBoardChange={setActiveBoard} />;
}
