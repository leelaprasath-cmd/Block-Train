import { ArticulatedTrainState } from '../../lib/utils/surveyedTrackSpline';

export interface FlexibleTrainConfig {
  id: string;
  name: string;
  type: 'vande_bharat' | 'express' | 'suburban' | 'freight';
  speedKmH: number;
  primaryColor: string;
  coachColor: string;
}

interface ArticulatedFlexibleTrainProps {
  config: FlexibleTrainConfig;
  trainState: ArticulatedTrainState;
  onClick: () => void;
}

export const ArticulatedFlexibleTrain = ({
  config,
  trainState,
  onClick
}: ArticulatedFlexibleTrainProps) => {
  const { locomotive, coaches } = trainState;
  const isVb = config.type === 'vande_bharat';
  const isFreight = config.type === 'freight';
  const isEmu = config.type === 'suburban';

  const bodyWidth = 14;
  const locoLen = isVb ? 34 : 30;
  const coachLen = isFreight ? 28 : 24;

  const containerColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706'];

  return (
    <g onClick={onClick} className="cursor-pointer group select-none">
      {/* 1. Powerful Forward Headlight Projection Beam from Locomotive */}
      <g
        style={{
          transform: `translate(${locomotive.x}px, ${locomotive.y}px) rotate(${locomotive.angle}deg)`,
          willChange: 'transform'
        }}
        className="pointer-events-none"
      >
        <polygon
          points={`
            ${locoLen / 2},-4
            ${locoLen / 2 + 80},-24
            ${locoLen / 2 + 80},24
            ${locoLen / 2},4
          `}
          fill="url(#flexible-headlight-grad)"
          opacity="0.8"
        />
      </g>

      {/* 2. Flexible Gangways / Drawbars connecting adjacent cars */}
      {coaches.map((coach, idx) => {
        const lead = idx === 0 ? locomotive : coaches[idx - 1];
        return (
          <line
            key={`gangway-${idx}`}
            x1={lead.x}
            y1={lead.y}
            x2={coach.x}
            y2={coach.y}
            stroke="#1e293b"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.9"
          />
        );
      })}

      {/* 3. Articulated Passenger / Freight Coaches (Each bends independently along the curve!) */}
      {coaches.map((coach, idx) => {
        const isLastCoach = idx === coaches.length - 1;
        const containerColor = containerColors[idx % containerColors.length];

        return (
          <g
            key={`coach-${idx}`}
            style={{
              transform: `translate(${coach.x}px, ${coach.y}px) rotate(${coach.angle}deg)`,
              willChange: 'transform'
            }}
          >
            {/* Ballast Drop Shadow */}
            <rect
              x={-coachLen / 2}
              y={-bodyWidth / 2 + 2}
              width={coachLen}
              height={bodyWidth + 2}
              fill="rgba(0,0,0,0.3)"
              rx="3"
            />

            {isFreight ? (
              // Freight Flatbed + Shipping Container
              <g>
                <rect
                  x={-coachLen / 2}
                  y={-bodyWidth / 2}
                  width={coachLen}
                  height={bodyWidth}
                  fill="#0f172a"
                  rx="1"
                />
                <rect
                  x={-coachLen / 2 + 2}
                  y={-bodyWidth / 2 + 1.5}
                  width={coachLen - 4}
                  height={bodyWidth - 3}
                  fill={containerColor}
                  rx="1"
                  stroke="#ffffff"
                  strokeWidth="0.4"
                  strokeOpacity="0.4"
                />
                {/* Last vehicle red beacon */}
                {isLastCoach && (
                  <circle cx={-coachLen / 2} cy="0" r="2" fill="#ef4444" className="animate-ping" />
                )}
              </g>
            ) : (
              // Passenger Coach Body
              <g>
                <rect
                  x={-coachLen / 2}
                  y={-bodyWidth / 2}
                  width={coachLen}
                  height={bodyWidth}
                  fill={config.coachColor}
                  rx="2.5"
                  stroke="#0f172a"
                  strokeWidth="0.7"
                />
                {/* Tinted Windows */}
                <rect
                  x={-coachLen / 2 + 3}
                  y="-2.5"
                  width={coachLen - 6}
                  height="5"
                  fill="#0f172a"
                  opacity="0.85"
                  rx="0.5"
                />
                {/* Interior Golden Window Lighting */}
                <rect x={-coachLen / 2 + 5} y="-1.5" width="4" height="3" fill="#fef08a" opacity="0.9" rx="0.5" />
                <rect x={coachLen / 2 - 9} y="-1.5" width="4" height="3" fill="#fef08a" opacity="0.9" rx="0.5" />

                {/* Rear flashing tail lamp on last car */}
                {isLastCoach && (
                  <g>
                    <circle cx={-coachLen / 2} cy="-3" r="1.5" fill="#ef4444" className="animate-pulse" />
                    <circle cx={-coachLen / 2} cy="3" r="1.5" fill="#ef4444" className="animate-pulse" />
                  </g>
                )}
              </g>
            )}
          </g>
        );
      })}

      {/* 4. Locomotive (Leading Engine with Independent Heading) */}
      <g
        style={{
          transform: `translate(${locomotive.x}px, ${locomotive.y}px) rotate(${locomotive.angle}deg)`,
          willChange: 'transform'
        }}
      >
        {/* Drop shadow */}
        <rect
          x={-locoLen / 2}
          y={-bodyWidth / 2 + 2}
          width={locoLen}
          height={bodyWidth + 2}
          fill="rgba(0,0,0,0.35)"
          rx="4"
        />

        {isVb ? (
          // Vande Bharat Aerodynamic Bullet Nose
          <g>
            <path
              d={`
                M ${-locoLen / 2} ${-bodyWidth / 2}
                L ${locoLen / 2 - 12} ${-bodyWidth / 2}
                Q ${locoLen / 2} ${-bodyWidth / 4} ${locoLen / 2} 0
                Q ${locoLen / 2} ${bodyWidth / 4} ${locoLen / 2 - 12} ${bodyWidth / 2}
                L ${-locoLen / 2} ${bodyWidth / 2}
                Z
              `}
              fill="#ffffff"
              stroke="#1e3a8a"
              strokeWidth="1.2"
            />
            {/* Blue aerodynamic nose strip */}
            <path
              d={`
                M ${-locoLen / 2 + 4} -1.5
                L ${locoLen / 2 - 6} -1.5
                Q ${locoLen / 2 - 1} 0 ${locoLen / 2 - 6} 1.5
                L ${-locoLen / 2 + 4} 1.5
                Z
              `}
              fill="#2563eb"
            />
            {/* Aerodynamic Cockpit Windshield */}
            <path
              d={`
                M ${locoLen / 2 - 13} -4
                Q ${locoLen / 2 - 5} 0 ${locoLen / 2 - 13} 4
                Z
              `}
              fill="#0f172a"
              opacity="0.9"
            />
            {/* Dual Bright LED Headlights */}
            <circle cx={locoLen / 2 - 2} cy="-3" r="1.5" fill="#fef08a" />
            <circle cx={locoLen / 2 - 2} cy="3" r="1.5" fill="#fef08a" />
          </g>
        ) : (
          // Electric Locomotive (WAP-7 / EMU / WAG-9)
          <g>
            <rect
              x={-locoLen / 2}
              y={-bodyWidth / 2}
              width={locoLen}
              height={bodyWidth}
              fill={config.primaryColor}
              rx={isEmu ? 2 : 4}
              stroke="#0f172a"
              strokeWidth="1"
            />
            {/* Front windshield */}
            <rect
              x={locoLen / 2 - 8}
              y={-bodyWidth / 2 + 2}
              width={5}
              height={bodyWidth - 4}
              fill="#0f172a"
              opacity="0.85"
              rx="1"
            />
            {/* Twin Headlights */}
            <circle cx={locoLen / 2 - 1} cy="-3.5" r="1.5" fill="#fef08a" />
            <circle cx={locoLen / 2 - 1} cy="3.5" r="1.5" fill="#fef08a" />
            {/* Roof Pantograph */}
            <line x1={-locoLen / 2 + 8} y1="-3" x2={-locoLen / 2 + 14} y2="3" stroke="#cbd5e1" strokeWidth="1" />
            <line x1={-locoLen / 2 + 14} y1="-3" x2={-locoLen / 2 + 8} y2="3" stroke="#cbd5e1" strokeWidth="1" />
          </g>
        )}

        {/* Floating Telemetry Tag on Hover */}
        <g
          style={{ transform: `rotate(${-locomotive.angle}deg)` }}
          className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          <rect
            x="-70"
            y="-42"
            width="140"
            height="26"
            fill="#0f172a"
            rx="8"
            stroke={config.primaryColor}
            strokeWidth="1.5"
            className="drop-shadow-2xl"
          />
          <text
            x="0"
            y="-25"
            fill="#ffffff"
            fontSize="10"
            textAnchor="middle"
            fontWeight="900"
            className="font-mono tracking-wide"
          >
            #{config.id} • {config.speedKmH} KM/H
          </text>
        </g>
      </g>
    </g>
  );
};
