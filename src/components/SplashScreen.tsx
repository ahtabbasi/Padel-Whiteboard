const APP_NAME = 'Padel Whiteboard';

export function SplashScreen() {
  return (
    <div className="splash-screen" role="status" aria-live="polite" aria-label={`Loading ${APP_NAME}`}>
      <img
        className="splash-screen-icon"
        src="./icons/icon-512.png"
        alt=""
        width={160}
        height={160}
      />
      <h1 className="splash-screen-title">{APP_NAME}</h1>
    </div>
  );
}
