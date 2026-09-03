import { ActiveGpsTrain } from '../../lib/hooks/useRealGpsTrains';

interface RealisticTrainRakeProps {
  train: ActiveGpsTrain;
  onClick: () => void;
}

export const RealisticTrainRake = ({ train, onClick }: RealisticTrainRakeProps) => {
  const isVandeBharat = train.type === 'vande_bharat';
  const isFreight = train.type === 'freight';
  const isEmu = train.type === 'suburban';

  // Proportions
  const bodyWidth = 16;
  const locoLen = isVandeBharat ? 38 : isFreight ? 34 : 32;
  const coachLen = isFreight ? 32 : isVandeBharat ? 28 : 24;
  const numCoaches = isFreight ? 5 : isVandeBharat ? 4 : 4;
  const gap = 3.5;
  const totalLen = locoLen + numCoaches * (coachLen + gap);

  // Colors based on train type
  const locoFill = isVandeBharat
    ? 'url(#vb-loco-grad)'
    : isFreight
    ? 'url(#freight-loco-grad)'
    : isEmu
    ? 'url(#emu-loco-grad)'
    : 'url(#lhb-loco-grad)';

  const coachFill = isVandeBharat
    ? 'url(#vb-coach-grad)'
    : isFreight
    ? '#0284c7'
    : isEmu
    ? 'url(#emu-coach-grad)'
    : 'url(#lhb-coach-grad)';

  // Freight container colors
  const containerColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea'];

  return (
    <g
      onClick={onClick}
      className="cursor-pointer group select-none"
      style={{
        transform: `rotate(${train.bearing}deg)`,
        willChange: 'transform'
      }}
    >
      {/* 1. Realistic Drop Shadow onto Track Ballast */}
      <rect
        x={-totalLen / 2}
        y={-bodyWidth / 2 + 3}
        width={totalLen}
        height={bodyWidth + 2}
        fill="rgba(0,0,0,0.35)"
        rx={4}
        filter="blur(1px)"
      />

      {/* 2. Powerful Forward Headlight Projection Beam onto Rails */}
      <polygon
        points={`
          ${totalLen / 2 - 2},-5
          ${totalLen / 2 + 75},-22
          ${totalLen / 2 + 75},22
          ${totalLen / 2 - 2},5
        `}
        fill="url(#headlight-cone-grad)"
        opacity="0.65"
        className="pointer-events-none"
      />

      {/* 3. Train Rake Body (Locomotive + Articulated Coaches) */}
      <g>
        {/* === A. LOCOMOTIVE (Leading Engine) === */}
        {(() => {
          const locoX = totalLen / 2 - locoLen;

          if (isVandeBharat) {
            // Aerodynamic Bullet Nose (Vande Bharat Trainset 18)
            return (
              <g>
                {/* Nose Wedge & Body */}
                <path
                  d={`
                    M ${locoX} ${-bodyWidth / 2}
                    L ${locoX + locoLen - 12} ${-bodyWidth / 2}
                    Q ${locoX + locoLen} ${-bodyWidth / 4} ${locoX + locoLen} 0
                    Q ${locoX + locoLen} ${bodyWidth / 4} ${locoX + locoLen - 12} ${bodyWidth / 2}
                    L ${locoX} ${bodyWidth / 2}
                    Z
                  `}
                  fill={locoFill}
                  stroke="#0f172a"
                  strokeWidth="0.8"
                />
                {/* Blue Aerodynamic Cheatline */}
                <path
                  d={`
                    M ${locoX} -1.5
                    L ${locoX + locoLen - 8} -1.5
                    Q ${locoX + locoLen - 2} 0 ${locoX + locoLen - 8} 1.5
                    L ${locoX} 1.5
                    Z
                  `}
                  fill="#1e3a8a"
                />
                {/* Aerodynamic Windshield */}
                <path
                  d={`
                    M ${locoX + locoLen - 14} -4
                    Q ${locoX + locoLen - 6} 0 ${locoX + locoLen - 14} 4
                    Z
                  `}
                  fill="#0f172a"
                  opacity="0.85"
                />
                {/* Dual LED Headlights */}
                <circle cx={locoX + locoLen - 2} cy="-3" r="1.5" fill="#fef08a" />
                <circle cx={locoX + locoLen - 2} cy="3" r="1.5" fill="#fef08a" />
                {/* Pantograph on Roof */}
                <line x1={locoX + 6} y1="-3" x2={locoX + 14} y2="3" stroke="#475569" strokeWidth="1" />
                <line x1={locoX + 14} y1="-3" x2={locoX + 6} y2="3" stroke="#475569" strokeWidth="1" />
              </g>
            );
          }

          // Electric Locomotive (WAP-7 / WAG-9 / EMU DMC)
          return (
            <g>
              {/* Main Rectangular Loco Body */}
              <rect
                x={locoX}
                y={-bodyWidth / 2}
                width={locoLen}
                height={bodyWidth}
                fill={locoFill}
                rx={isEmu ? 2 : 4}
                stroke="#0f172a"
                strokeWidth="0.8"
              />
              {/* Front Windshield Cabin */}
              <rect
                x={locoX + locoLen - 8}
                y={-bodyWidth / 2 + 2}
                width={5}
                height={bodyWidth - 4}
                fill="#0f172a"
                opacity="0.8"
                rx={1}
              />
              {/* Headlights */}
              <circle cx={locoX + locoLen - 1} cy="-4" r="1.5" fill="#fef08a" />
              <circle cx={locoX + locoLen - 1} cy="4" r="1.5" fill="#fef08a" />
              {/* Roof AC & Pantograph */}
              <rect x={locoX + 6} y="-2" width={locoLen - 16} height="4" fill="#334155" rx="1" />
              <line x1={locoX + 8} y1="-4" x2={locoX + 14} y2="4" stroke="#e2e8f0" strokeWidth="1" />
              <line x1={locoX + 14} y1="-4" x2={locoX + 8} y2="4" stroke="#e2e8f0" strokeWidth="1" />
            </g>
          );
        })()}

        {/* === B. COACHES (Coupled Cars) === */}
        {Array.from({ length: numCoaches }).map((_, cIdx) => {
          const coachX = totalLen / 2 - locoLen - gap - (cIdx + 1) * coachLen - cIdx * gap;
          const isLastCoach = cIdx === numCoaches - 1;

          if (isFreight) {
            // Freight Flatcar + ISO Shipping Container
            const containerColor = containerColors[cIdx % containerColors.length];
            return (
              <g key={`freight-car-${cIdx}`}>
                {/* Coupler */}
                <rect x={coachX + coachLen} y="-2" width={gap} height="4" fill="#1e293b" />
                {/* Flatbed wagon chassis */}
                <rect x={coachX} y={-bodyWidth / 2 - 0.5} width={coachLen} height={bodyWidth + 1} fill="#1e293b" rx="1" />
                {/* Loaded Shipping Container */}
                <rect
                  x={coachX + 2}
                  y={-bodyWidth / 2 + 1}
                  width={coachLen - 4}
                  height={bodyWidth - 2}
                  fill={containerColor}
                  rx="1"
                  stroke="#0f172a"
                  strokeWidth="0.5"
                />
                {/* Container Ribs / Corrugation */}
                <line x1={coachX + 7} y1={-bodyWidth / 2 + 2} x2={coachX + 7} y2={bodyWidth / 2 - 2} stroke="#ffffff" opacity="0.3" strokeWidth="0.8" />
                <line x1={coachX + 14} y1={-bodyWidth / 2 + 2} x2={coachX + 14} y2={bodyWidth / 2 - 2} stroke="#ffffff" opacity="0.3" strokeWidth="0.8" />
                <line x1={coachX + 21} y1={-bodyWidth / 2 + 2} x2={coachX + 21} y2={bodyWidth / 2 - 2} stroke="#ffffff" opacity="0.3" strokeWidth="0.8" />
                {/* Last Vehicle (LV) Board at rear */}
                {isLastCoach && (
                  <g>
                    <circle cx={coachX - 1} cy="0" r="2.5" fill="#ef4444" className="animate-ping" />
                    <circle cx={coachX - 1} cy="0" r="2" fill="#dc2626" />
                  </g>
                )}
              </g>
            );
          }

          // Passenger Coach (Vande Bharat / LHB Express / EMU)
          return (
            <g key={`pass-coach-${cIdx}`}>
              {/* Coupler */}
              <rect x={coachX + coachLen} y="-2" width={gap} height="4" fill="#334155" />

              {/* Coach Body */}
              <rect
                x={coachX}
                y={-bodyWidth / 2}
                width={coachLen}
                height={bodyWidth}
                fill={coachFill}
                rx="2"
                stroke="#0f172a"
                strokeWidth="0.6"
              />

              {/* Panoramic / Tinted Windows */}
              <rect
                x={coachX + 3}
                y="-3"
                width={coachLen - 6}
                height="6"
                fill="#0f172a"
                opacity={isVandeBharat ? 0.9 : 0.75}
                rx="1"
              />

              {/* Interior Warm Passenger Window Glows */}
              {Array.from({ length: 4 }).map((_, wIdx) => (
                <rect
                  key={`win-${wIdx}`}
                  x={coachX + 5 + wIdx * 5}
                  y="-1.5"
                  width="3"
                  height="3"
                  fill="#fef08a"
                  opacity="0.8"
                  rx="0.5"
                />
              ))}

              {/* Roof Ventilation Ridge */}
              <line
                x1={coachX + 3}
                y1={-bodyWidth / 2 + 1.5}
                x2={coachX + coachLen - 3}
                y2={-bodyWidth / 2 + 1.5}
                stroke="#cbd5e1"
                strokeWidth="0.8"
                opacity="0.6"
              />

              {/* Rear End Flashing Red Tail Marker */}
              {isLastCoach && (
                <g>
                  <circle cx={coachX} cy="-4" r="1.5" fill="#ef4444" className="animate-pulse" />
                  <circle cx={coachX} cy="4" r="1.5" fill="#ef4444" className="animate-pulse" />
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* 4. Hover Telemetry Label (Floating, doesn't hide the train) */}
      <g
        style={{ transform: `rotate(${-train.bearing}deg)` }}
        className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      >
        <rect
          x="-75"
          y="-42"
          width="150"
          height="26"
          fill="#0f172a"
          rx="6"
          stroke={train.color}
          strokeWidth="1"
          className="drop-shadow-xl"
        />
        <text
          x="0"
          y="-25"
          fill="#ffffff"
          fontSize="10"
          textAnchor="middle"
          fontWeight="800"
          className="font-mono tracking-wider"
        >
          #{train.id} • {train.currentSpeedKmH} KM/H
        </text>
      </g>
    </g>
  );
};
