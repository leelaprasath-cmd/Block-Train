import { memo } from 'react';

export const TrackLine = memo(({ x1, y1, x2, y2, opacity = 1 }: any) => (
  <g opacity={opacity}>
    {/* Ballast / Track Bed */}
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd5e1" strokeWidth="12" opacity="0.75" />
    {/* Concrete Sleepers */}
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748b" strokeWidth="8" strokeDasharray="3 9" />
    {/* Outer Rails (Steel) */}
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e293b" strokeWidth="4" />
    {/* Inner Hollow (Bright background color) */}
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f8fafc" strokeWidth="2" />
  </g>
));
