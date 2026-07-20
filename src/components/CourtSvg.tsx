import { COURT_VIEW_HEIGHT, COURT_VIEW_WIDTH, NET_Y, SERVICE_LINE_A_Y, SERVICE_LINE_B_Y } from '../lib/courtGeometry';
import { toPxX, toPxY } from '../lib/svgCoords';

/** Static padel court markings: outer walls, net, service lines, and center service line. */
export function CourtSvg() {
  const netYPx = toPxY(NET_Y);
  const serviceAYPx = toPxY(SERVICE_LINE_A_Y);
  const serviceBYPx = toPxY(SERVICE_LINE_B_Y);
  const centerXPx = toPxX(0.5);

  return (
    <g className="court-lines">
      <rect x={0} y={0} width={COURT_VIEW_WIDTH} height={COURT_VIEW_HEIGHT} className="court-surface" />
      <rect x={0} y={0} width={COURT_VIEW_WIDTH} height={COURT_VIEW_HEIGHT} className="court-outline" />
      <line x1={0} y1={netYPx} x2={COURT_VIEW_WIDTH} y2={netYPx} className="net-line" />
      <line x1={0} y1={serviceAYPx} x2={COURT_VIEW_WIDTH} y2={serviceAYPx} className="service-line" />
      <line x1={0} y1={serviceBYPx} x2={COURT_VIEW_WIDTH} y2={serviceBYPx} className="service-line" />
      <line x1={centerXPx} y1={serviceBYPx} x2={centerXPx} y2={serviceAYPx} className="center-service-line" />
    </g>
  );
}
