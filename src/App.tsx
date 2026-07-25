import { useEffect, useState } from 'preact/hooks';
import type { AppId, Board } from './types';
import { AppLauncher } from './components/AppLauncher';
import { BoardEditor } from './components/BoardEditor';
import { SplashScreen } from './components/SplashScreen';
import { TournamentApp } from './components/TournamentApp';
import { resolveInitialBoard } from './lib/storage';
import { getActiveApp, setActiveApp } from './lib/appSelection';

const SPLASH_MIN_MS = 2000;

export function App() {
  const [activeApp, setActiveAppState] = useState<AppId | null>(() => getActiveApp());
  const [activeBoard, setActiveBoard] = useState<Board>(() => resolveInitialBoard());
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), SPLASH_MIN_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  const handleSelectApp = (appId: AppId) => {
    setActiveApp(appId);
    setActiveAppState(appId);
  };

  const handleGoHome = () => {
    setActiveAppState(null);
  };

  if (!activeApp) {
    return <AppLauncher onSelect={handleSelectApp} />;
  }

  if (activeApp === 'tournament') {
    return <TournamentApp onHome={handleGoHome} />;
  }

  return (
    <BoardEditor
      key={activeBoard.id}
      initialBoard={activeBoard}
      onBoardChange={setActiveBoard}
      onHome={handleGoHome}
    />
  );
}
