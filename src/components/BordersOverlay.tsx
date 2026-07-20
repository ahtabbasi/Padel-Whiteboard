import {
  BACK_WALL_GLASS_PANEL_COUNT,
  COURT_VIEW_HEIGHT,
  COURT_VIEW_WIDTH,
  SIDE_ENTRANCE_Y0,
  SIDE_ENTRANCE_Y1,
} from '../lib/courtGeometry';
import { toPxY } from '../lib/svgCoords';

/** Visible thickness of walls in the top-down SVG view. */
const GLASS_DEPTH = 8;
const PANEL_GAP_PX = 3;
const SIDE_GLASS_PANEL_COUNT = 2;

interface PanelLayout {
  panelSize: number;
  gap: number;
  count: number;
  offset: number;
}

/** Evenly distributes `count` panels with gaps across `spanPx`, centered on the span. */
function layoutPanels(spanPx: number, count: number, gapPx: number): PanelLayout {
  const totalGap = (count - 1) * gapPx;
  const panelSize = (spanPx - totalGap) / count;
  const used = panelSize * count + totalGap;
  const offset = (spanPx - used) / 2;
  return { panelSize, gap: gapPx, count, offset };
}

function GlassPanelsHorizontal({
  y,
  height,
  layout,
}: {
  y: number;
  height: number;
  layout: PanelLayout;
}) {
  const { panelSize, gap, count, offset } = layout;

  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = offset + i * (panelSize + gap);
        return <rect key={i} x={x} y={y} width={panelSize} height={height} className="wall-glass" />;
      })}
    </>
  );
}

function SideGlassPanels({
  x,
  anchor,
  panelSize,
}: {
  x: number;
  anchor: 'top' | 'bottom';
  panelSize: number;
}) {
  const gap = PANEL_GAP_PX;
  const ys =
    anchor === 'top'
      ? Array.from({ length: SIDE_GLASS_PANEL_COUNT }, (_, i) => i * (panelSize + gap))
      : Array.from(
          { length: SIDE_GLASS_PANEL_COUNT },
          (_, i) => COURT_VIEW_HEIGHT - panelSize - i * (panelSize + gap),
        );

  return (
    <>
      {ys.map((y, i) => (
        <rect key={i} x={x} y={y} width={GLASS_DEPTH} height={panelSize} className="wall-glass" />
      ))}
    </>
  );
}

function SideFenceWithEntrance({
  x,
  fenceStartPx,
  fenceEndPx,
  entranceStartPx,
  entranceEndPx,
}: {
  x: number;
  fenceStartPx: number;
  fenceEndPx: number;
  entranceStartPx: number;
  entranceEndPx: number;
}) {
  const segments: { y: number; height: number }[] = [];

  if (entranceStartPx > fenceStartPx) {
    segments.push({ y: fenceStartPx, height: entranceStartPx - fenceStartPx });
  }
  if (fenceEndPx > entranceEndPx) {
    segments.push({ y: entranceEndPx, height: fenceEndPx - entranceEndPx });
  }

  return (
    <>
      {segments.map((segment, i) => (
        <rect
          key={i}
          x={x}
          y={segment.y}
          width={GLASS_DEPTH}
          height={segment.height}
          className="wall-fence"
        />
      ))}
    </>
  );
}

/**
 * Decorative walls: white glass panels (5 across each back wall, 2 per side end),
 * with a solid gray fence bar in the remaining side space toward the net.
 */
export function BordersOverlay() {
  const backLayout = layoutPanels(COURT_VIEW_WIDTH, BACK_WALL_GLASS_PANEL_COUNT, PANEL_GAP_PX);
  const glassBlockDepth = SIDE_GLASS_PANEL_COUNT * backLayout.panelSize + PANEL_GAP_PX;
  const fenceStartPx = glassBlockDepth + PANEL_GAP_PX;
  const fenceEndPx = COURT_VIEW_HEIGHT - glassBlockDepth - PANEL_GAP_PX;
  const entranceStartPx = toPxY(SIDE_ENTRANCE_Y0);
  const entranceEndPx = toPxY(SIDE_ENTRANCE_Y1);

  return (
    <g className="borders-overlay">
      <GlassPanelsHorizontal y={0} height={GLASS_DEPTH} layout={backLayout} />
      <GlassPanelsHorizontal y={COURT_VIEW_HEIGHT - GLASS_DEPTH} height={GLASS_DEPTH} layout={backLayout} />

      {[0, COURT_VIEW_WIDTH - GLASS_DEPTH].map((x) => (
        <g key={x}>
          <SideGlassPanels x={x} anchor="top" panelSize={backLayout.panelSize} />
          <SideGlassPanels x={x} anchor="bottom" panelSize={backLayout.panelSize} />
          <SideFenceWithEntrance
            x={x}
            fenceStartPx={fenceStartPx}
            fenceEndPx={fenceEndPx}
            entranceStartPx={entranceStartPx}
            entranceEndPx={entranceEndPx}
          />
        </g>
      ))}
    </g>
  );
}
