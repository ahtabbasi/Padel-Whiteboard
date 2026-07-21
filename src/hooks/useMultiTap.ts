import { useCallback, useRef } from 'preact/hooks';

interface UseMultiTapOptions {
  requiredTaps: number;
  windowMs: number;
  onTrigger: () => void;
}

export function useMultiTap({ requiredTaps, windowMs, onTrigger }: UseMultiTapOptions) {
  const tapTimesRef = useRef<number[]>([]);

  const onTap = useCallback(() => {
    const now = Date.now();
    const recent = tapTimesRef.current.filter((t) => now - t < windowMs);
    recent.push(now);
    tapTimesRef.current = recent;

    if (recent.length >= requiredTaps) {
      tapTimesRef.current = [];
      onTrigger();
    }
  }, [requiredTaps, windowMs, onTrigger]);

  return { onTap };
}
