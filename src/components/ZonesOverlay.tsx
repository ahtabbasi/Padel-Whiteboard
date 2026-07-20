import { COURT_VIEW_WIDTH, getZoneBands } from '../lib/courtGeometry';
import { toPxY } from '../lib/svgCoords';
import type { DisplaySettings } from '../types';

interface ZonesOverlayProps {
  settings: DisplaySettings;
}

/** Fixed horizontal bands showing the attack / no-man (red) / defence zones on each half. */
export function ZonesOverlay({ settings }: ZonesOverlayProps) {
  const bands = getZoneBands();

  const renderBands = (list: { y0: number; y1: number }[], className: string) =>
    list.map((band, i) => (
      <rect
        key={`${className}-${i}`}
        x={0}
        y={toPxY(band.y0)}
        width={COURT_VIEW_WIDTH}
        height={toPxY(band.y1) - toPxY(band.y0)}
        className={className}
      />
    ));

  return (
    <g className="zones-overlay">
      {settings.showDefenceZone && renderBands(bands.defence, 'zone-defence')}
      {settings.showNoManZone && renderBands(bands.noMan, 'zone-no-man')}
      {settings.showAttackZone && renderBands(bands.attack, 'zone-attack')}
    </g>
  );
}
