import {
  BACK_WALL_GLASS_PANEL_COUNT,
  COURT_VIEW_HEIGHT,
  COURT_VIEW_WIDTH,
} from '../lib/courtGeometry';

/** Visible thickness of walls in the top-down SVG view. */
const GLASS_DEPTH = 8;
const PANEL_GAP_PX = 3;
const SIDE_GLASS_PANEL_COUNT = 2;
const SIDE_FENCE_PANEL_COUNT = 6;

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

function SideFencePanels({
  x,
  y0,
  panelSize,
}: {
  x: number;
  y0: number;
  panelSize: number;
}) {
  const gap = PANEL_GAP_PX;

  return (
    <>
      {Array.from({ length: SIDE_FENCE_PANEL_COUNT }, (_, i) => {
        const y = y0 + i * (panelSize + gap);
        return <rect key={i} x={x} y={y} width={GLASS_DEPTH} height={panelSize} className="wall-fence" />;
      })}
    </>
  );
}

/** Side stack: 2 glass + 6 fence + 2 glass panels, each separated by the same gap. */
function layoutSidePanels(): { panelSize: number; glassBlockDepth: number; fenceStartPx: number } {
  const sidePanelCount = SIDE_GLASS_PANEL_COUNT * 2 + SIDE_FENCE_PANEL_COUNT;
  const panelSize =
    (COURT_VIEW_HEIGHT - (sidePanelCount - 1) * PANEL_GAP_PX) / sidePanelCount;
  const glassBlockDepth = SIDE_GLASS_PANEL_COUNT * panelSize + PANEL_GAP_PX;
  const fenceStartPx = glassBlockDepth + PANEL_GAP_PX;
  return { panelSize, glassBlockDepth, fenceStartPx };
}

/**
 * Decorative walls: white glass panels (5 across each back wall, 2 per side end),
 * with segmented gray fence panels (same size and spacing as glass) toward the net.
 */
export function BordersOverlay() {
  const backLayout = layoutPanels(COURT_VIEW_WIDTH, BACK_WALL_GLASS_PANEL_COUNT, PANEL_GAP_PX);
  const sideLayout = layoutSidePanels();

  return (
    <g className="borders-overlay">
      <GlassPanelsHorizontal y={0} height={GLASS_DEPTH} layout={backLayout} />
      <GlassPanelsHorizontal y={COURT_VIEW_HEIGHT - GLASS_DEPTH} height={GLASS_DEPTH} layout={backLayout} />

      {[0, COURT_VIEW_WIDTH - GLASS_DEPTH].map((x) => (
        <g key={x}>
          <SideGlassPanels x={x} anchor="top" panelSize={sideLayout.panelSize} />
          <SideGlassPanels x={x} anchor="bottom" panelSize={sideLayout.panelSize} />
          <SideFencePanels x={x} y0={sideLayout.fenceStartPx} panelSize={sideLayout.panelSize} />
        </g>
      ))}
    </g>
  );
}
