import { COURT_VIEW_WIDTH, getNoManZoneBands } from '../lib/courtGeometry';
import { toPxY } from '../lib/svgCoords';
import type { DisplaySettings } from '../types';

interface ZonesOverlayProps {
  settings: DisplaySettings;
}

/** Fixed horizontal bands showing the no-man (red) zones on each half. */
export function ZonesOverlay({ settings }: ZonesOverlayProps) {
  if (!settings.showNoManZone) return null;

  const bands = getNoManZoneBands();

  return (
    <g className="zones-overlay">
      {bands.map((band, i) => (
        <rect
          key={i}
          x={0}
          y={toPxY(band.y0)}
          width={COURT_VIEW_WIDTH}
          height={toPxY(band.y1) - toPxY(band.y0)}
          className="zone-no-man"
        />
      ))}
    </g>
  );
}
