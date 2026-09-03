import { useState, useEffect, useMemo, useRef } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import {
  SURVEYED_MAIN_TRACKS,
  SURVEYED_CHETPET_BRANCHES,
  SURVEYED_TURNOUTS,
  SURVEYED_STATION_LOOPS,
  CANVAS_BOUNDS,
  projectGpsToCanvas
} from '../../data/surveyedRailwayNetwork';
import { REAL_STATIONS } from '../../data/realTracksData';
import {
  getArticulatedTrain,
  pointsToSvgPath
} from '../../lib/utils/surveyedTrackSpline';
import {
  ArticulatedFlexibleTrain,
  FlexibleTrainConfig
} from '../train/ArticulatedFlexibleTrain';
import { Construction, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DigitalTwinMapProps {
  speedMultiplier: number;
  blockActive: boolean;
  onToggleBlock: () => void;
  onSelectTrainForWimt?: (trainId: string, speedKmH: number) => void;
}

// All corridor stations including Chetpet and Chennai Beach
const ALL_CORRIDOR_STATIONS = [
  ...REAL_STATIONS,
  { id: 'MSC', code: 'MSC', name: 'Chetpet', lat: 13.0685, lng: 80.2428, platforms: 4, division: 'MAS', type: 'suburban' as const },
  { id: 'MPK', code: 'MPK', name: 'Chennai Park', lat: 13.0805, lng: 80.2745, platforms: 4, division: 'MAS', type: 'suburban' as const },
  { id: 'MSB', code: 'MSB', name: 'Chennai Beach', lat: 13.0945, lng: 80.2930, platforms: 8, division: 'MAS', type: 'terminal' as const }
];

const TRAIN_CONFIGS: FlexibleTrainConfig[] = [
  {
    id: '20643',
    name: 'Vande Bharat Express',
    type: 'vande_bharat',
    speedKmH: 130,
    primaryColor: '#2563eb',
    coachColor: '#ffffff'
  },
  {
    id: '12638',
    name: 'Pandian Superfast Express',
    type: 'express',
    speedKmH: 110,
    primaryColor: '#dc2626',
    coachColor: '#ef4444'
  },
  {
    id: '40012',
    name: 'Suburban EMU Local',
    type: 'suburban',
    speedKmH: 75,
    primaryColor: '#0284c7',
    coachColor: '#38bdf8'
  },
  {
    id: '66042',
    name: 'CONCOR Heavy Freight',
    type: 'freight',
    speedKmH: 60,
    primaryColor: '#16a34a',
    coachColor: '#0284c7'
  }
];

const StationNavigatorControls = ({
  blockActive,
  onToggleBlock
}: {
  blockActive: boolean;
  onToggleBlock: () => void;
}) => {
  const { setTransform, zoomIn, zoomOut, resetTransform } = useControls();
  const [activeCode, setActiveCode] = useState<string>('MSC');

  const jumpTo = (st: (typeof ALL_CORRIDOR_STATIONS)[0]) => {
    setActiveCode(st.code);
    const { x, y } = projectGpsToCanvas(st.lat, st.lng);
    const scale = 0.75;
    const targetX = -x * scale + window.innerWidth / 2;
    const targetY = -y * scale + window.innerHeight / 2;
    setTransform(targetX, targetY, scale, 500, 'easeOut');
  };

  return (
    <>
      {/* Top Floating Block Injector */}
      <div className="absolute top-20 right-6 z-40 flex items-center gap-3 select-none pointer-events-auto font-mono">
        <button
          onClick={onToggleBlock}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold shadow-xl backdrop-blur-md transition-all ${
            blockActive
              ? 'bg-red-600 text-white border-red-500 ring-2 ring-red-400/50 shadow-red-500/30'
              : 'bg-white/95 text-slate-800 border-slate-200 hover:border-red-300 hover:text-red-600'
          }`}
        >
          <Construction className="w-4 h-4 text-amber-300" />
          <span>
            {blockActive
              ? 'ACTIVE BLOCK: TBM ⇄ CMP (AUTO DIVERSION)'
              : 'INJECT BLOCK: TBM ⇄ CMP'}
          </span>
          {blockActive ? (
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          )}
        </button>
      </div>

      {/* Bottom Floating Station Quick Navigator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 max-w-[95vw] pointer-events-auto select-none font-mono">
        <div className="flex items-center gap-1.5 bg-white/95 p-1.5 rounded-2xl border border-slate-200 shadow-2xl backdrop-blur-md overflow-x-auto max-w-full no-scrollbar">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 border-r border-slate-200 shrink-0">
            CORRIDOR STATIONS
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {ALL_CORRIDOR_STATIONS.map((st) => (
              <button
                key={st.id}
                onClick={() => jumpTo(st)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all shrink-0 ${
                  activeCode === st.code
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={`${st.name} - ${st.platforms} Platforms`}
              >
                {st.code}
              </button>
            ))}
          </div>
          <div className="border-l border-slate-200 pl-1.5 flex items-center gap-1 shrink-0">
            <button
              onClick={() => zoomIn(0.25)}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => zoomOut(0.25)}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={() => resetTransform(400, 'easeOut')}
              className="px-2 h-7 flex items-center justify-center text-[10px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors uppercase"
              title="Reset Overview"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const DigitalTwinMap = ({
  speedMultiplier,
  blockActive,
  onToggleBlock,
  onSelectTrainForWimt
}: DigitalTwinMapProps) => {
  // Train arc distance tracking (initial offsets along corridor)
  const [trainDistances, setTrainDistances] = useState<number[]>([18500, 12000, 7200, 3200]);
  const lastTimeRef = useRef<number>(performance.now());

  // High-performance animation frame loop with smooth lookahead tangent (Zero Jitter)
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      setTrainDistances((prev) =>
        prev.map((d, i) => {
          const config = TRAIN_CONFIGS[i];
          // Advance distance smoothly based on km/h and speed multiplier
          // Canvas scale: ~22,000px corresponds to ~75 km
          const pxPerSec = (config.speedKmH / 75) * 320 * speedMultiplier;
          return d + pxPerSec * dt;
        })
      );

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [speedMultiplier]);

  // Compute articulated train states (each car bends along curves independently!)
  const articulatedTrains = useMemo(() => {
    return trainDistances.map((d, i) => {
      const isFreight = TRAIN_CONFIGS[i].type === 'freight';
      const coachCount = isFreight ? 5 : 4;
      const spacing = isFreight ? 34 : 30;
      return getArticulatedTrain(d, coachCount, spacing);
    });
  }, [trainDistances]);

  // Pre-generate SVG path strings for maximum rendering performance
  const mainlineSvgPaths = useMemo(() => {
    return SURVEYED_MAIN_TRACKS.map((t) => pointsToSvgPath(t.canvasPoints));
  }, []);

  const chetpetBranchSvgPaths = useMemo(() => {
    return SURVEYED_CHETPET_BRANCHES.map((t) => pointsToSvgPath(t.canvasPoints));
  }, []);

  const turnoutSvgPaths = useMemo(() => {
    return SURVEYED_TURNOUTS.map((t) => pointsToSvgPath(t.canvasPoints));
  }, []);

  const loopSvgPaths = useMemo(() => {
    return SURVEYED_STATION_LOOPS.map((t) => pointsToSvgPath(t.canvasPoints));
  }, []);

  // Center initial view near Chetpet / Egmore / Central junction complex
  const chetpetPt = projectGpsToCanvas(13.072, 80.252);
  const startX = -chetpetPt.x * 0.65 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 600);
  const startY = -chetpetPt.y * 0.65 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#f8fafc] railway-cursor">
      <TransformWrapper
        key="surveyed-digital-twin-wrapper"
        initialScale={0.65}
        initialPositionX={startX}
        initialPositionY={startY}
        minScale={0.2}
        maxScale={4.5}
        limitToBounds={false}
        wheel={{ step: 0.1 }}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <div
            className="relative bg-[#f8fafc]"
            style={{ width: CANVAS_BOUNDS.width, height: CANVAS_BOUNDS.height }}
          >
            {/* Engineering Grid (Clean railway blueprint background) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
                backgroundSize: '100px 100px'
              }}
            />

            {/* SVG Surveyed Railway Network */}
            <svg
              width={CANVAS_BOUNDS.width}
              height={CANVAS_BOUNDS.height}
              className="block drop-shadow-sm"
            >
              <defs>
                {/* Powerful Conical Headlight Beam */}
                <linearGradient id="flexible-headlight-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#fde047" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* 1. Track Ballast Bed (Dark stone base following surveyed curves) */}
              <g id="ballast-beds" opacity="0.6">
                {mainlineSvgPaths.map((d, i) => (
                  <path key={`ballast-main-${i}`} d={d} stroke="#cbd5e1" strokeWidth="18" fill="none" strokeLinecap="round" />
                ))}
                {chetpetBranchSvgPaths.map((d, i) => (
                  <path key={`ballast-chetpet-${i}`} d={d} stroke="#cbd5e1" strokeWidth="14" fill="none" strokeLinecap="round" />
                ))}
                {turnoutSvgPaths.map((d, i) => (
                  <path key={`ballast-turnout-${i}`} d={d} stroke="#fde68a" strokeWidth="12" fill="none" strokeLinecap="round" />
                ))}
                {loopSvgPaths.map((d, i) => (
                  <path key={`ballast-loop-${i}`} d={d} stroke="#e2e8f0" strokeWidth="12" fill="none" strokeLinecap="round" />
                ))}
              </g>

              {/* 2. Concrete Sleepers (Ties) */}
              <g id="track-sleepers" opacity="0.7">
                {mainlineSvgPaths.map((d, i) => (
                  <path key={`sleepers-main-${i}`} d={d} stroke="#64748b" strokeWidth="12" strokeDasharray="3 7" fill="none" />
                ))}
                {chetpetBranchSvgPaths.map((d, i) => (
                  <path key={`sleepers-chetpet-${i}`} d={d} stroke="#64748b" strokeWidth="10" strokeDasharray="3 6" fill="none" />
                ))}
              </g>

              {/* 3. Real Steel Rails (Polished Double Rails) */}
              <g id="steel-rails">
                {/* Mainline Rails (Deep Navy) */}
                {mainlineSvgPaths.map((d, i) => (
                  <g key={`rails-main-${i}`}>
                    <path d={d} stroke="#0f172a" strokeWidth="4" fill="none" />
                    <path d={d} stroke="#f8fafc" strokeWidth="2" fill="none" />
                  </g>
                ))}

                {/* All Branches North of Chetpet (Egmore, Central, Park, MMC, Beach) */}
                {chetpetBranchSvgPaths.map((d, i) => (
                  <g key={`rails-chetpet-${i}`}>
                    <path d={d} stroke="#1e3a8a" strokeWidth="3.5" fill="none" />
                    <path d={d} stroke="#93c5fd" strokeWidth="1.5" fill="none" />
                  </g>
                ))}

                {/* Real-World Crossover Turnouts (Vibrant Amber switches where lines merge!) */}
                {turnoutSvgPaths.map((d, i) => (
                  <path key={`rails-turnout-${i}`} d={d} stroke="#d97706" strokeWidth="3" fill="none" strokeDasharray="6 2" />
                ))}

                {/* Station Platform Loops */}
                {loopSvgPaths.map((d, i) => (
                  <path key={`rails-loop-${i}`} d={d} stroke="#64748b" strokeWidth="2.5" fill="none" />
                ))}
              </g>

              {/* 4. Active Maintenance Block Segment (with animated hazard stripes) */}
              {blockActive && (
                <g className="animate-pulse">
                  {/* Block between Tambaram (12.925) and Chromepet (12.951) */}
                  <rect
                    x={projectGpsToCanvas(12.938, 80.129).x - 120}
                    y={projectGpsToCanvas(12.938, 80.129).y - 40}
                    width="240"
                    height="80"
                    fill="#ef4444"
                    fillOpacity="0.2"
                    rx="12"
                    stroke="#dc2626"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                  />
                  <text
                    x={projectGpsToCanvas(12.938, 80.129).x}
                    y={projectGpsToCanvas(12.938, 80.129).y + 5}
                    fill="#dc2626"
                    fontSize="12"
                    fontWeight="900"
                    textAnchor="middle"
                    className="font-mono tracking-wider"
                  >
                    ⚠️ MAINTENANCE BLOCK: TBM ⇄ CMP
                  </text>
                </g>
              )}

              {/* 5. Geographic Stations Placed at Real Surveyed Coordinates */}
              {ALL_CORRIDOR_STATIONS.map((st) => {
                const { x, y } = projectGpsToCanvas(st.lat, st.lng);
                const isMajor = st.type === 'terminal' || st.type === 'junction';

                return (
                  <g key={st.id} className="select-none">
                    {/* Platform Base Indicator */}
                    <rect
                      x={x - 60}
                      y={y - 18}
                      width="120"
                      height="36"
                      fill="#ffffff"
                      stroke={isMajor ? '#1e3a8a' : '#cbd5e1'}
                      strokeWidth="1.5"
                      rx="10"
                      className="drop-shadow-sm"
                    />

                    {/* Platform Count Badge */}
                    <rect
                      x={x - 52}
                      y={y - 12}
                      width="28"
                      height="24"
                      fill={isMajor ? '#1e3a8a' : '#f1f5f9'}
                      rx="6"
                    />
                    <text
                      x={x - 38}
                      y={y + 4}
                      fill={isMajor ? '#facc15' : '#475569'}
                      fontSize="9"
                      fontWeight="900"
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {st.platforms}P
                    </text>

                    {/* Station Code & Name */}
                    <text
                      x={x - 18}
                      y={y - 1}
                      fill="#0f172a"
                      fontSize="11"
                      fontWeight="900"
                      className="font-mono tracking-tight"
                    >
                      {st.code}
                    </text>
                    <text
                      x={x - 18}
                      y={y + 11}
                      fill="#64748b"
                      fontSize="8"
                      fontWeight="700"
                      className="font-mono truncate"
                    >
                      {st.name.slice(0, 11)}
                    </text>
                  </g>
                );
              })}

              {/* 6. Flexible Articulated Multi-Coach Trains (Bending along real curves with ZERO jitter!) */}
              {articulatedTrains.map((trainState, idx) => {
                const config = TRAIN_CONFIGS[idx];
                return (
                  <ArticulatedFlexibleTrain
                    key={`train-${config.id}`}
                    config={config}
                    trainState={trainState}
                    onClick={() => {
                      if (onSelectTrainForWimt) {
                        onSelectTrainForWimt(config.id, config.speedKmH);
                      }
                    }}
                  />
                );
              })}
            </svg>
          </div>
        </TransformComponent>

        {/* Station Navigation Controls & Block Injector */}
        <StationNavigatorControls
          blockActive={blockActive}
          onToggleBlock={onToggleBlock}
        />
      </TransformWrapper>
    </div>
  );
};
