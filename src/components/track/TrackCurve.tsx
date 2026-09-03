import { memo } from 'react';

export const TrackCurve = memo(({ d, opacity = 1 }: any) => {
  // Matches "M x y ... L x y" to extract start and end coordinates for frogs
  const match = d.match(/^M ([\d.-]+) ([\d.-]+).*L ([\d.-]+) ([\d.-]+)$/);
  
  return (
    <g opacity={opacity}>
      <path d={d} stroke="#cbd5e1" strokeWidth="12" fill="transparent" opacity="0.75" />
      <path d={d} stroke="#64748b" strokeWidth="8" strokeDasharray="3 9" fill="transparent" />
      <path d={d} stroke="#1e293b" strokeWidth="4" fill="transparent" />
      <path d={d} stroke="#f8fafc" strokeWidth="2" fill="transparent" />
      
      {/* Switch Frogs (Yellow mechanical divergence points) */}
      {match && (
        <>
          <circle cx={match[1]} cy={match[2]} r="2.5" fill="#eab308" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx={match[3]} cy={match[4]} r="2.5" fill="#eab308" stroke="#1e293b" strokeWidth="1.5" />
        </>
      )}
    </g>
  );
});
