export const TelemetryTag = ({ id, angle }: { id: string, angle: number }) => (
  <g style={{ transform: `rotate(${-angle}deg)` }} className="opacity-0 group-hover:opacity-100 transition-opacity">
    <rect x="-30" y="-35" width="60" height="24" fill="#ffffff" rx="6" stroke="#94a3b8" strokeWidth="1" className="drop-shadow-md" />
    <text x="0" y="-20" fill="#0f172a" fontSize="10" textAnchor="middle" fontWeight="800" className="font-mono tracking-widest">
      {id}
    </text>
  </g>
);
