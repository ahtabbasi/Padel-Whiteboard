import { useState } from 'preact/hooks';
import type { Board } from './types';
import { BoardEditor } from './components/BoardEditor';
import { BoardLibrary } from './components/BoardLibrary';

export function App() {
  const [openBoard, setOpenBoard] = useState<Board | null>(null);

  if (openBoard) {
    return <BoardEditor initialBoard={openBoard} onBack={() => setOpenBoard(null)} />;
  }

  return <BoardLibrary onOpen={setOpenBoard} />;
}
