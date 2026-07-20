import { COURT_VIEW_HEIGHT, COURT_VIEW_WIDTH, SIDE_WALL_GLASS_END } from '../lib/courtGeometry';
import { toPxY } from '../lib/svgCoords';

/**
 * Decorative wall representation: both back walls are fully glass; each side
 * wall is glass for the back ~2/3 (matching the back walls) and fence/mesh
 * for the front ~1/3 nearest the net. Purely cosmetic, no gameplay effect.
 */
export function BordersOverlay() {
  const glassEndTopPx = toPxY(SIDE_WALL_GLASS_END);
  const glassStartBottomPx = toPxY(1 - SIDE_WALL_GLASS_END);

  return (
    <g className="borders-overlay">
      {/* Back walls: fully glass */}
      <line x1={0} y1={0} x2={COURT_VIEW_WIDTH} y2={0} className="wall-glass" />
      <line x1={0} y1={COURT_VIEW_HEIGHT} x2={COURT_VIEW_WIDTH} y2={COURT_VIEW_HEIGHT} className="wall-glass" />

      {/* Side walls: glass near each back wall, fence near the net */}
      {[0, COURT_VIEW_WIDTH].map((x) => (
        <g key={x}>
          <line x1={x} y1={0} x2={x} y2={glassEndTopPx} className="wall-glass" />
          <line x1={x} y1={glassEndTopPx} x2={x} y2={glassStartBottomPx} className="wall-fence" />
          <line x1={x} y1={glassStartBottomPx} x2={x} y2={COURT_VIEW_HEIGHT} className="wall-glass" />
        </g>
      ))}
    </g>
  );
}
