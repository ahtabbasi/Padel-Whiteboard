interface TournamentResetModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function TournamentResetModal({ onCancel, onConfirm }: TournamentResetModalProps) {
  return (
    <div className="t-modal-backdrop" onClick={onCancel}>
      <div className="t-modal" onClick={(e) => e.stopPropagation()}>
        <div className="t-modal-header">
          <WarningIcon />
          <span>Reset tournament?</span>
        </div>
        <p className="t-modal-copy">This clears all teams, scores, and progress. This can't be undone.</p>
        <div className="t-modal-actions">
          <button type="button" className="t-modal-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="t-modal-confirm" onClick={onConfirm}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="t-warning-icon">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
