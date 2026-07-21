interface InstallInstructionsSheetProps {
  onClose: () => void;
}

export function InstallInstructionsSheet({ onClose }: InstallInstructionsSheetProps) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <span className="sheet-title">Add to Home Screen</span>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <ol className="install-steps">
          <li>
            Tap the <strong>Share</strong> button in the Safari toolbar
          </li>
          <li>
            Scroll and tap <strong>Add to Home Screen</strong>
          </li>
          <li>
            Tap <strong>Add</strong> to confirm
          </li>
        </ol>
      </div>
    </div>
  );
}
