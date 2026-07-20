import { useCallback, useRef } from 'preact/hooks';
import { clientToNormalizedPoint } from '../lib/svgCoords';
import type { Point } from '../types';

interface UsePointerDragOptions {
  onMove: (point: Point) => void;
  onEnd: (point: Point, wasTap: boolean) => void;
}

/** Screen-pixel movement below this is treated as a tap rather than a drag. */
const TAP_THRESHOLD_PX = 6;

/**
 * Shared pointer-drag handling for SVG elements: unifies touch and mouse via
 * Pointer Events, uses pointer capture so movement is tracked even if the
 * pointer leaves the element, and distinguishes a "tap" (no meaningful
 * movement) from a real drag.
 */
export function usePointerDrag({ onMove, onEnd }: UsePointerDragOptions) {
  const startClient = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  const onPointerDown = useCallback((e: PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    startClient.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
  }, []);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!startClient.current) return;
      const svg = (e.currentTarget as SVGGraphicsElement).ownerSVGElement;
      if (!svg) return;
      const dx = e.clientX - startClient.current.x;
      const dy = e.clientY - startClient.current.y;
      if (Math.hypot(dx, dy) > TAP_THRESHOLD_PX) moved.current = true;
      onMove(clientToNormalizedPoint(svg, e.clientX, e.clientY));
    },
    [onMove],
  );

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      if (!startClient.current) return;
      const svg = (e.currentTarget as SVGGraphicsElement).ownerSVGElement;
      const point = svg ? clientToNormalizedPoint(svg, e.clientX, e.clientY) : { x: 0, y: 0 };
      const wasTap = !moved.current;
      startClient.current = null;
      onEnd(point, wasTap);
    },
    [onEnd],
  );

  return { onPointerDown, onPointerMove, onPointerUp };
}
