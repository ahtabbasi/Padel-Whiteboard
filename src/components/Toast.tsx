import { useEffect } from 'preact/hooks';

interface ToastProps {
  message: string;
  durationMs?: number;
  onDismiss: () => void;
}

export function Toast({ message, durationMs = 8000, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs, onDismiss]);

  return (
    <div
      className="toast"
      role="status"
      aria-live="polite"
      onClick={onDismiss}
    >
      {message}
    </div>
  );
}
