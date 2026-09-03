import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { ActiveGpsTrain } from '../../lib/hooks/useRealGpsTrains';

interface RealTrainMarkersProps {
  trains: ActiveGpsTrain[];
  onSelectTrain: (train: ActiveGpsTrain) => void;
  selectedTrainId?: string;
}

export const RealTrainMarkers = ({
  trains,
  onSelectTrain,
  selectedTrainId
}: RealTrainMarkersProps) => {
  return (
    <>
      {trains.map((train) => {
        const isSelected = selectedTrainId === train.id;
        const isVb = train.type === 'vande_bharat';
        const isFreight = train.type === 'freight';
        const isEmu = train.type === 'suburban';

        // Proportions for train rake on map
        const locoLen = isVb ? 32 : 28;
        const coachLen = isFreight ? 26 : 22;
        const coachCount = isFreight ? 4 : 3;
        const totalLen = locoLen + coachCount * (coachLen + 3);

        const locoColor = isVb
          ? '#2563eb'
          : isFreight
          ? '#16a34a'
          : isEmu
          ? '#0284c7'
          : '#dc2626';

        const coachColor = isVb
          ? '#f8fafc'
          : isFreight
          ? '#0284c7'
          : isEmu
          ? '#38bdf8'
          : '#ef4444';

        return (
          <AdvancedMarker
            key={train.id}
            position={train.position}
            onClick={() => onSelectTrain(train)}
            title={`${train.name} (${train.id}) - ${train.currentSpeedKmH} km/h`}
          >
            <div className="relative group cursor-pointer select-none">
              {/* SVG Physical Train Rake */}
              <div
                style={{
                  transform: `rotate(${train.bearing}deg)`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s linear'
                }}
                className="relative"
              >
                <svg
                  width={totalLen + 60}
                  height="36"
                  viewBox={`-20 -18 ${totalLen + 60} 36`}
                  className="overflow-visible drop-shadow-2xl"
                >
                  <defs>
                    <linearGradient id={`hl-grad-${train.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#fde047" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Forward Headlight Beam on Satellite Rails */}
                  <polygon
                    points={`
                      ${totalLen / 2},-4
                      ${totalLen / 2 + 55},-18
                      ${totalLen / 2 + 55},18
                      ${totalLen / 2},4
                    `}
                    fill={`url(#hl-grad-${train.id})`}
                    className="pointer-events-none"
                  />

                  {/* Drop shadow on ballast */}
                  <rect
                    x={-totalLen / 2}
                    y="-7"
                    width={totalLen}
                    height="14"
                    fill="rgba(0,0,0,0.5)"
                    rx="3"
                  />

                  {/* === LOCOMOTIVE === */}
                  {(() => {
                    const lx = totalLen / 2 - locoLen;
                    if (isVb) {
                      // Aerodynamic Bullet Nose (Vande Bharat)
                      return (
                        <g>
                          <path
                            d={`
                              M ${lx} -6
                              L ${lx + locoLen - 10} -6
                              Q ${lx + locoLen} -3 ${lx + locoLen} 0
                              Q ${lx + locoLen} 3 ${lx + locoLen - 10} 6
                              L ${lx} 6
                              Z
                            `}
                            fill="#ffffff"
                            stroke="#1e3a8a"
                            strokeWidth="1.2"
                          />
                          <path
                            d={`
                              M ${lx + 6} -1.5
                              L ${lx + locoLen - 6} -1.5
                              Q ${lx + locoLen - 2} 0 ${lx + locoLen - 6} 1.5
                              L ${lx + 6} 1.5
                              Z
                            `}
                            fill="#2563eb"
                          />
                          {/* Cockpit Window */}
                          <path
                            d={`
                              M ${lx + locoLen - 11} -3.5
                              Q ${lx + locoLen - 5} 0 ${lx + locoLen - 11} 3.5
                              Z
                            `}
                            fill="#0f172a"
                          />
                          {/* Dual Headlights */}
                          <circle cx={lx + locoLen - 2} cy="-2.5" r="1.2" fill="#fef08a" />
                          <circle cx={lx + locoLen - 2} cy="2.5" r="1.2" fill="#fef08a" />
                        </g>
                      );
                    }

                    // Electric Locomotive (WAP-7 / EMU / WAG-9)
                    return (
                      <g>
                        <rect
                          x={lx}
                          y="-6"
                          width={locoLen}
                          height="12"
                          fill={locoColor}
                          rx={isEmu ? 1.5 : 3}
                          stroke="#0f172a"
                          strokeWidth="0.8"
                        />
                        <rect
                          x={lx + locoLen - 6}
                          y="-4.5"
                          width="4"
                          height="9"
                          fill="#0f172a"
                          rx="1"
                        />
                        <circle cx={lx + locoLen - 1} cy="-3" r="1.2" fill="#fef08a" />
                        <circle cx={lx + locoLen - 1} cy="3" r="1.2" fill="#fef08a" />
                      </g>
                    );
                  })()}

                  {/* === ARTICULATED COACHES === */}
                  {Array.from({ length: coachCount }).map((_, cIdx) => {
                    const cx = totalLen / 2 - locoLen - 3 - (cIdx + 1) * coachLen - cIdx * 3;
                    return (
                      <g key={`coach-${cIdx}`}>
                        {/* Coupler */}
                        <rect x={cx + coachLen} y="-1.5" width="3" height="3" fill="#334155" />
                        {/* Coach Body */}
                        <rect
                          x={cx}
                          y="-6"
                          width={coachLen}
                          height="12"
                          fill={coachColor}
                          rx="2"
                          stroke="#0f172a"
                          strokeWidth="0.6"
                        />
                        {/* Windows */}
                        <rect x={cx + 3} y="-2" width={coachLen - 6} height="4" fill="#0f172a" rx="0.5" />
                        <circle cx={cx + 6} cy="0" r="1" fill="#fef08a" opacity="0.8" />
                        <circle cx={cx + coachLen - 6} cy="0" r="1" fill="#fef08a" opacity="0.8" />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Sleek Floating Telemetry Badge on Hover / Selected */}
              <div
                className={`absolute left-1/2 -top-9 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shadow-xl backdrop-blur-md pointer-events-none transition-all ${
                  isSelected
                    ? 'opacity-100 scale-105 bg-slate-900 text-white border-blue-400'
                    : 'opacity-0 group-hover:opacity-100 bg-white/95 text-slate-900 border-slate-300'
                }`}
              >
                <span className="font-mono text-[11px] font-black">{train.id}</span>
                <span className="text-[10px] text-slate-400">|</span>
                <span className="font-mono text-[10px] font-bold text-blue-600">
                  {train.currentSpeedKmH} km/h
                </span>
                {train.isDiverted && (
                  <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1 rounded">
                    DIVERT
                  </span>
                )}
              </div>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};
