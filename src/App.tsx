import { useEffect, useState } from 'preact/hooks';
import type { Board } from './types';
import { BoardEditor } from './components/BoardEditor';
import { SplashScreen } from './components/SplashScreen';
import { resolveInitialBoard } from './lib/storage';

const SPLASH_MIN_MS = 2000;

export function App() {
  const [activeBoard, setActiveBoard] = useState<Board>(() => resolveInitialBoard());
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), SPLASH_MIN_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <BoardEditor
      key={activeBoard.id}
      initialBoard={activeBoard}
      onBoardChange={setActiveBoard}
    />
  );
}
