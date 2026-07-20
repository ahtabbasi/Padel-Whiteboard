import { COURT_VIEW_HEIGHT, COURT_VIEW_WIDTH, clamp01 } from './courtGeometry';
import type { Point } from '../types';

/** Converts a pointer event's client coordinates into normalized (0..1) court coordinates. */
export function clientToNormalizedPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point {
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const point = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
  return { x: clamp01(point.x / COURT_VIEW_WIDTH), y: clamp01(point.y / COURT_VIEW_HEIGHT) };
}

export function toPxX(x: number): number {
  return x * COURT_VIEW_WIDTH;
}

export function toPxY(y: number): number {
  return y * COURT_VIEW_HEIGHT;
}
