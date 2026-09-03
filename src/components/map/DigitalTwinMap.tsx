import { useState, useEffect, useMemo, useRef } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import {
  CORRIDOR_STATIONS,
  UP_MAIN_TRACK,
  DOWN_MAIN_TRACK,
  UP_SUBURBAN_TRACK,
  DOWN_SUBURBAN_TRACK,
  SCHEMATIC_BOUNDS,
  StationData
} from '../../data/cglToMasTracks';
import {
  getArticulatedTrain,
  trackToSvgPath
} from '../../lib/utils/cglToMasSpline';
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
  const [activeCode, setActiveCode] = useState<string>('TBM');

  const jumpTo = (st: StationData) => {
    setActiveCode(st.code);
    const scale = 0.85;
    const targetX = -st.x * scale + window.innerWidth / 2;
    const targetY = -st.y * scale + window.innerHeight / 2;
    setTransform(targetX, targetY, scale, 500, 'easeOut');
  };

  // Only key passenger stations along the Chengalpattu to Central line
  const keyStations = CORRIDOR_STATIONS.filter(
    (s) => !s.name.includes('Siding') && !s.name.includes('Outer')
  );

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
            CGL ➔ MAS
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {keyStations.map((st) => (
              <button
                key={st.code}
                onClick={() => jumpTo(st)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all shrink-0 ${
                  activeCode === st.code
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={`${st.name} (${st.code}) - ${st.platforms} Platforms`}
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
  // Train distance tracking along corridor (Chengalpattu to Central is ~4663px)
  const [trainDistances, setTrainDistances] = useState<number[]>([3800, 2600, 1400, 600]);
  const lastTimeRef = useRef<number>(performance.now());

  // Smooth animation loop without angle jitter
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      setTrainDistances((prev) =>
        prev.map((d, i) => {
          const config = TRAIN_CONFIGS[i];
          // Scale: 4663px for ~60km corridor
          const pxPerSec = (config.speedKmH / 60) * 75 * speedMultiplier;
          return d + pxPerSec * dt;
        })
      );

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [speedMultiplier]);

  // Articulated train state (each coach bends along track curve independently!)
  const articulatedTrains = useMemo(() => {
    return trainDistances.map((d, i) => {
      // Train 0: Up Fast Track (diverts to suburban if blockActive)
      const track =
        i === 0
          ? blockActive && d > 2000 && d < 2800
            ? UP_SUBURBAN_TRACK
            : UP_MAIN_TRACK
          : i === 1
          ? DOWN_MAIN_TRACK
          : i === 2
          ? UP_SUBURBAN_TRACK
          : DOWN_SUBURBAN_TRACK;

      const isFreight = TRAIN_CONFIGS[i].type === 'freight';
      const coachCount = isFreight ? 5 : 4;
      const spacing = isFreight ? 30 : 26;

      return getArticulatedTrain(track, d, coachCount, spacing);
    });
  }, [trainDistances, blockActive]);

  // Pre-generate SVG path strings
  const upMainPath = useMemo(() => trackToSvgPath(UP_MAIN_TRACK), []);
  const downMainPath = useMemo(() => trackToSvgPath(DOWN_MAIN_TRACK), []);
  const upSuburbanPath = useMemo(() => trackToSvgPath(UP_SUBURBAN_TRACK), []);
  const downSuburbanPath = useMemo(() => trackToSvgPath(DOWN_SUBURBAN_TRACK), []);

  // Center initial view near Tambaram (index 12)
  const tbm = CORRIDOR_STATIONS[12];
  const startX = -tbm.x * 0.75 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 600);
  const startY = -tbm.y * 0.75 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#f8fafc] railway-cursor">
      <TransformWrapper
        key="clean-cgl-mas-wrapper"
        initialScale={0.75}
        initialPositionX={startX}
        initialPositionY={startY}
        minScale={0.25}
        maxScale={4.0}
        limitToBounds={false}
        wheel={{ step: 0.1 }}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <div
            className="relative bg-[#f8fafc]"
            style={{ width: SCHEMATIC_BOUNDS.width, height: SCHEMATIC_BOUNDS.height }}
          >
            {/* Subtle Blueprint Grid (Matching real geographic orientation) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(15, 23, 42, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px)',
                backgroundSize: '120px 120px'
              }}
            />

            {/* SVG Track Infrastructure */}
            <svg
              width={SCHEMATIC_BOUNDS.width}
              height={SCHEMATIC_BOUNDS.height}
              className="block drop-shadow-sm"
            >
              <defs>
                <linearGradient id="flexible-headlight-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                  <stop offset="40%" stopColor="#fde047" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* 1. Stone Ballast Bed (Smooth gravel base following real satellite curves) */}
              <g id="ballast-bed" opacity="0.6">
                {/* Double Track from Chengalpattu to Tambaram */}
                <path d={upMainPath} stroke="#cbd5e1" strokeWidth="22" fill="none" strokeLinecap="round" />
                <path d={downMainPath} stroke="#cbd5e1" strokeWidth="22" fill="none" strokeLinecap="round" />

                {/* Quadruple Track from Tambaram to Chennai Central */}
                <path d={upSuburbanPath} stroke="#e2e8f0" strokeWidth="18" fill="none" strokeLinecap="round" />
                <path d={downSuburbanPath} stroke="#e2e8f0" strokeWidth="18" fill="none" strokeLinecap="round" />
              </g>

              {/* 2. Concrete Sleepers (Ties) */}
              <g id="concrete-sleepers" opacity="0.75">
                <path d={upMainPath} stroke="#64748b" strokeWidth="14" strokeDasharray="3 7" fill="none" />
                <path d={downMainPath} stroke="#64748b" strokeWidth="14" strokeDasharray="3 7" fill="none" />
                <path d={upSuburbanPath} stroke="#64748b" strokeWidth="12" strokeDasharray="3 7" fill="none" />
                <path d={downSuburbanPath} stroke="#64748b" strokeWidth="12" strokeDasharray="3 7" fill="none" />
              </g>

              {/* 3. Polished Steel Rails (Actual Number of Tracks) */}
              <g id="steel-rails">
                {/* UP MAIN FAST LINE (Steel Navy & Silver) */}
                <path d={upMainPath} stroke="#0f172a" strokeWidth="4.5" fill="none" />
                <path d={upMainPath} stroke="#f8fafc" strokeWidth="2.5" fill="none" />

                {/* DOWN MAIN FAST LINE */}
                <path d={downMainPath} stroke="#0f172a" strokeWidth="4.5" fill="none" />
                <path d={downMainPath} stroke="#f8fafc" strokeWidth="2.5" fill="none" />

                {/* UP SUBURBAN SLOW LINE (from Tambaram to Central) */}
                <path d={upSuburbanPath} stroke="#0284c7" strokeWidth="3.5" fill="none" />
                <path d={upSuburbanPath} stroke="#e0f2fe" strokeWidth="1.8" fill="none" />

                {/* DOWN SUBURBAN SLOW LINE (from Tambaram to Central) */}
                <path d={downSuburbanPath} stroke="#0284c7" strokeWidth="3.5" fill="none" />
                <path d={downSuburbanPath} stroke="#e0f2fe" strokeWidth="1.8" fill="none" />
              </g>

              {/* 4. Active Maintenance Block between Tambaram & Chromepet */}
              {blockActive && (
                <g className="animate-pulse">
                  <rect
                    x={CORRIDOR_STATIONS[12].x + 40}
                    y={CORRIDOR_STATIONS[12].y - 35}
                    width={CORRIDOR_STATIONS[14].x - CORRIDOR_STATIONS[12].x}
                    height="70"
                    fill="#ef4444"
                    fillOpacity="0.25"
                    rx="12"
                    stroke="#dc2626"
                    strokeWidth="3"
                    strokeDasharray="8 6"
                  />
                  <text
                    x={(CORRIDOR_STATIONS[12].x + CORRIDOR_STATIONS[14].x) / 2}
                    y={CORRIDOR_STATIONS[12].y + 5}
                    fill="#dc2626"
                    fontSize="11"
                    fontWeight="900"
                    textAnchor="middle"
                    className="font-mono tracking-wider"
                  >
                    ⚠️ MAINTENANCE BLOCK: TBM ⇄ CMP (AI DIVERSION ACTIVE)
                  </text>
                </g>
              )}

              {/* 5. Geographic Stations from Chengalpattu to Central */}
              {CORRIDOR_STATIONS.map((st) => {
                const isMajor = st.code === 'CGL' || st.code === 'TBM' || st.code === 'MS' || st.code === 'MAS';

                return (
                  <g key={st.code} className="select-none">
                    {/* Platform Base Indicator Box */}
                    <rect
                      x={st.x - 55}
                      y={st.y - 18}
                      width="110"
                      height="36"
                      fill="#ffffff"
                      stroke={isMajor ? '#1e3a8a' : '#cbd5e1'}
                      strokeWidth={isMajor ? '2' : '1.5'}
                      rx="10"
                      className="drop-shadow-sm"
                    />

                    {/* Platform Count Pill */}
                    <rect
                      x={st.x - 48}
                      y={st.y - 12}
                      width="26"
                      height="24"
                      fill={isMajor ? '#1e3a8a' : '#f1f5f9'}
                      rx="6"
                    />
                    <text
                      x={st.x - 35}
                      y={st.y + 4}
                      fill={isMajor ? '#facc15' : '#475569'}
                      fontSize="9"
                      fontWeight="900"
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {st.platforms || st.pf || 4}P
                    </text>

                    {/* Station Code & Name */}
                    <text
                      x={st.x - 16}
                      y={st.y - 1}
                      fill="#0f172a"
                      fontSize="11"
                      fontWeight="900"
                      className="font-mono tracking-tight"
                    >
                      {st.code}
                    </text>
                    <text
                      x={st.x - 16}
                      y={st.y + 11}
                      fill="#64748b"
                      fontSize="8"
                      fontWeight="700"
                      className="font-mono truncate"
                    >
                      {st.name.slice(0, 10)}
                    </text>
                  </g>
                );
              })}

              {/* 6. Flexible Multi-Coach Trains Bending Along Curves */}
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

        {/* Station Navigation Controls */}
        <StationNavigatorControls
          blockActive={blockActive}
          onToggleBlock={onToggleBlock}
        />
      </TransformWrapper>
    </div>
  );
};
