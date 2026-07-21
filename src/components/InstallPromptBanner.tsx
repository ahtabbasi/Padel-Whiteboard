interface InstallPromptBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
}

export function InstallPromptBanner({ onInstall, onDismiss }: InstallPromptBannerProps) {
  return (
    <div className="install-prompt-banner" role="region" aria-label="Install app">
      <img
        className="install-prompt-icon"
        src="./icons/icon-192.png"
        alt=""
        width={32}
        height={32}
      />
      <span className="install-prompt-text">Install Padel Whiteboard?</span>
      <button type="button" className="install-prompt-action" onClick={onInstall}>
        Install
      </button>
      <button
        type="button"
        className="icon-button install-prompt-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss install prompt"
      >
        ✕
      </button>
    </div>
  );
}
