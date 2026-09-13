import { useState, useMemo } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import {
  UP_SLOW_LINE,
  DN_SLOW_LINE,
  UP_FAST_LINE,
  DN_FAST_LINE,
  REAL_STATIONS,
  GeoStation
} from '../../data/realTracksData';
import { useTimetableTrains, TimetableActiveTrain } from '../../lib/hooks/useTimetableTrains';
import { RealisticTrainRake } from '../train/RealisticTrainRake';
import { ActiveGpsTrain } from '../../lib/hooks/useRealGpsTrains';
import { Radio, Zap } from 'lucide-react';

interface ExtractedRealTrackCanvasProps {
  speedMultiplier: number;
  blockActive: boolean;
  onSelectTrainForWimt: (train: TimetableActiveTrain) => void;
}

// Projection bounds for Southern Railway GST Corridor
const MIN_LNG = 79.96;
const MAX_LNG = 80.30;
const MIN_LAT = 12.67;
const MAX_LAT = 13.11;

const CANVAS_W = 4600;
const CANVAS_H = 2800;

// Project (lat, lng) to (canvasX, canvasY)
const projectToCanvas = (lat: number, lng: number): { x: number; y: number } => {
  const normX = (lng - MIN_LNG) / (MAX_LNG - MIN_LNG);
  const normY = 1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT);

  const paddingX = 350;
  const paddingY = 220;

  const x = paddingX + normX * (CANVAS_W - paddingX * 2);
  const y = paddingY + normY * (CANVAS_H - paddingY * 2);

  return { x, y };
};

// Generate smooth SVG curve path from points
const createSvgPath = (points: { x: number; y: number }[]): string => {
  if (points.length < 2) return '';
  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const pPrev = points[i - 1];
    const pCurr = points[i];
    const midX = (pPrev.x + pCurr.x) / 2;
    const midY = (pPrev.y + pCurr.y) / 2;
    path += ` Q ${pPrev.x.toFixed(1)} ${pPrev.y.toFixed(1)} ${midX.toFixed(1)} ${midY.toFixed(1)}`;
  }
  const last = points[points.length - 1];
  path += ` L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
  return path;
};

const ExtractedTrackControls = () => {
  const { setTransform, zoomIn, zoomOut, resetTransform } = useControls();
  const [activeCode, setActiveCode] = useState<string>('TBM');

  const jumpToStation = (st: GeoStation) => {
    setActiveCode(st.code);
    const { x, y } = projectToCanvas(st.lat, st.lng);
    const scale = 0.85;
    const targetX = -x * scale + window.innerWidth / 2;
    const targetY = -y * scale + window.innerHeight / 2;
    setTransform(targetX, targetY, scale, 500, 'easeOut');
  };

  return (
    <>
      {/* Bottom Floating Station Navigator Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 max-w-[96vw] pointer-events-auto select-none font-mono">
        <div className="flex items-center gap-2 occ-dock-glass p-1.5 rounded-2xl shadow-xl overflow-x-auto max-w-full no-scrollbar border border-slate-200 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-1.5 px-3 border-r border-slate-200 shrink-0 text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              REAL 4-TRACK CORRIDOR
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {REAL_STATIONS.map((st) => {
              const isMajor = ['MAS', 'MS', 'MBM', 'TBM', 'CGL'].includes(st.code);
              const isActive = activeCode === st.code;

              return (
                <button
                  key={st.id}
                  onClick={() => jumpToStation(st)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500'
                      : isMajor
                      ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title={`${st.name} (${st.platforms} Platforms)`}
                >
                  <span>{st.code}</span>
                  {isMajor && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-200/60 text-amber-900 font-extrabold">
                      {st.platforms}P
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-l border-slate-200 pl-2 flex items-center gap-1 shrink-0">
            <button
              onClick={() => zoomIn(0.2)}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shadow-xs"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => zoomOut(0.2)}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shadow-xs"
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={() => resetTransform(400, 'easeOut')}
              className="px-2.5 h-7 flex items-center justify-center text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all uppercase tracking-wider shadow-xs"
              title="Reset Corridor View"
            >
              Overview
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const ExtractedRealTrackCanvas = ({
  speedMultiplier,
  blockActive,
  onSelectTrainForWimt
}: ExtractedRealTrackCanvasProps) => {
  // Authentic Timetable-Driven Trains
  const trains = useTimetableTrains(speedMultiplier, blockActive);

  // Project real GPS track lines directly to canvas coordinates (4 Real-World Tracks)
  const upSlowPoints = useMemo(() => UP_SLOW_LINE.map((p) => projectToCanvas(p.lat, p.lng)), []);
  const dnSlowPoints = useMemo(() => DN_SLOW_LINE.map((p) => projectToCanvas(p.lat, p.lng)), []);
  const upFastPoints = useMemo(() => UP_FAST_LINE.map((p) => projectToCanvas(p.lat, p.lng)), []);
  const dnFastPoints = useMemo(() => DN_FAST_LINE.map((p) => projectToCanvas(p.lat, p.lng)), []);

  const upSlowPath = useMemo(() => createSvgPath(upSlowPoints), [upSlowPoints]);
  const dnSlowPath = useMemo(() => createSvgPath(dnSlowPoints), [dnSlowPoints]);
  const upFastPath = useMemo(() => createSvgPath(upFastPoints), [upFastPoints]);
  const dnFastPath = useMemo(() => createSvgPath(dnFastPoints), [dnFastPoints]);

  // Block path between Tambaram and Chromepet on Track 3 (UP FAST)
  const blockPoints = useMemo(() => {
    return UP_FAST_LINE
      .filter((p) => p.lat >= 12.9230 && p.lat <= 12.9530)
      .map((p) => projectToCanvas(p.lat, p.lng));
  }, []);
  const blockPath = useMemo(() => createSvgPath(blockPoints), [blockPoints]);

  // Initial focus centered near Tambaram / Chromepet
  const tbmPt = projectToCanvas(12.9256, 80.1171);
  const startX = -tbmPt.x * 0.5 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const startY = -tbmPt.y * 0.5 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#f8fafc]">
      {/* Real-World 4-Track Line Legend & Timetable HUD */}
      <div className="absolute top-4 left-6 z-20 pointer-events-auto flex flex-col gap-2 font-mono max-w-sm select-none">
        <div className="p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl space-y-2 text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>REAL-WORLD QUAD-TRACK GRID</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-extrabold">
              4 RUNNING LINES
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-sky-500 inline-block" />
                <span className="font-medium text-slate-700">Line 1: UP SLOW</span>
              </div>
              <span className="text-slate-500">Suburban to Beach (75 km/h)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-cyan-600 inline-block" />
                <span className="font-medium text-slate-700">Line 2: DN SLOW</span>
              </div>
              <span className="text-slate-500">Suburban to CGL (75 km/h)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-blue-600 inline-block" />
                <span className="font-bold text-blue-700">Line 3: UP FAST</span>
              </div>
              <span className="font-bold text-blue-700">Vande Bharat 20643 (130 km/h)</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-rose-600 inline-block" />
                <span className="font-medium text-slate-700">Line 4: DN FAST</span>
              </div>
              <span className="text-slate-500">Tejas & Freight (110 km/h)</span>
            </div>
          </div>

          {blockActive && (
            <div className="pt-2 border-t border-rose-200 text-[10px] text-rose-700 font-bold flex items-center gap-1.5 animate-pulse">
              <Radio className="w-3 h-3 text-rose-600" />
              <span>BLOCK ON TRACK 3: AI DIVERSION TO TRACK 1 ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      <TransformWrapper
        key="extracted-tracks-wrapper"
        initialScale={0.5}
        initialPositionX={startX}
        initialPositionY={startY}
        minScale={0.15}
        maxScale={4.5}
        limitToBounds={false}
        wheel={{ step: 0.1 }}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%', cursor: 'grab' }}>
          <div className="relative bg-[#f8fafc]" style={{ width: CANVAS_W, height: CANVAS_H }}>
            {/* Engineering Grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)',
                backgroundSize: '120px 120px'
              }}
            />

            {/* SVG Track Infrastructure */}
            <svg width={CANVAS_W} height={CANVAS_H} className="block drop-shadow-sm">
              <defs>
                {/* Conical Headlight Beam */}
                <linearGradient id="headlight-cone-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                  <stop offset="35%" stopColor="#fde047" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
                </linearGradient>
                {/* Vande Bharat (Trainset 18) Gradients */}
                <linearGradient id="vb-loco-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#e2e8f0" />
                  <stop offset="70%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="vb-coach-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="25%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#1d4ed8" />
                  <stop offset="75%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>
                {/* LHB Superfast (Pandian) Gradients */}
                <linearGradient id="lhb-loco-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <linearGradient id="lhb-coach-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="45%" stopColor="#b91c1c" />
                  <stop offset="55%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                {/* Suburban EMU Gradients */}
                <linearGradient id="emu-loco-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
                <linearGradient id="emu-coach-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#0369a1" />
                  <stop offset="75%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                {/* Heavy Freight WAG-9 Gradients */}
                <linearGradient id="freight-loco-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#14532d" />
                </linearGradient>
              </defs>

              {/* 4 Real-World Ballast Beds following surveyed curves */}
              <path d={upSlowPath} stroke="#e2e8f0" strokeWidth="22" fill="none" opacity="0.75" strokeLinecap="round" />
              <path d={dnSlowPath} stroke="#e2e8f0" strokeWidth="22" fill="none" opacity="0.75" strokeLinecap="round" />
              <path d={upFastPath} stroke="#cbd5e1" strokeWidth="24" fill="none" opacity="0.8" strokeLinecap="round" />
              <path d={dnFastPath} stroke="#cbd5e1" strokeWidth="24" fill="none" opacity="0.8" strokeLinecap="round" />

              {/* Concrete Sleepers (Ties) for all 4 lines */}
              <path d={upSlowPath} stroke="#94a3b8" strokeWidth="15" strokeDasharray="3 8" fill="none" />
              <path d={dnSlowPath} stroke="#94a3b8" strokeWidth="15" strokeDasharray="3 8" fill="none" />
              <path d={upFastPath} stroke="#64748b" strokeWidth="17" strokeDasharray="3 8" fill="none" />
              <path d={dnFastPath} stroke="#64748b" strokeWidth="17" strokeDasharray="3 8" fill="none" />

              {/* Steel Rails: Distinct Colors per line for clear executive visibility */}
              {/* Track 1: Up Slow */}
              <path d={upSlowPath} stroke="#0284c7" strokeWidth="4.5" fill="none" />
              <path d={upSlowPath} stroke="#e0f2fe" strokeWidth="2" fill="none" />

              {/* Track 2: Down Slow */}
              <path d={dnSlowPath} stroke="#0369a1" strokeWidth="4.5" fill="none" />
              <path d={dnSlowPath} stroke="#e0f2fe" strokeWidth="2" fill="none" />

              {/* Track 3: Up Fast (Vande Bharat Express) */}
              <path d={upFastPath} stroke="#2563eb" strokeWidth="5.5" fill="none" />
              <path d={upFastPath} stroke="#ffffff" strokeWidth="2.5" fill="none" />

              {/* Track 4: Down Fast (Superfast & Freight) */}
              <path d={dnFastPath} stroke="#dc2626" strokeWidth="5" fill="none" />
              <path d={dnFastPath} stroke="#fee2e2" strokeWidth="2.5" fill="none" />

              {/* Maintenance Block Zone on Track 3 (UP FAST) */}
              {blockActive && (
                <g className="animate-pulse">
                  <path d={blockPath} stroke="#ef4444" strokeWidth="36" fill="none" opacity="0.35" strokeLinecap="round" />
                  <path d={blockPath} stroke="#dc2626" strokeWidth="10" strokeDasharray="12 6" fill="none" strokeLinecap="round" />
                </g>
              )}

              {/* Real-World Station Platforms & Hubs */}
              {REAL_STATIONS.map((st) => {
                const { x, y } = projectToCanvas(st.lat, st.lng);
                const isMajor = st.type === 'terminal' || st.type === 'junction';

                return (
                  <g key={st.id} className="select-none">
                    {/* Station Yard Area Box */}
                    <rect
                      x={x - 130}
                      y={y - 65}
                      width={260}
                      height={130}
                      fill="rgba(255, 255, 255, 0.94)"
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                      rx="16"
                      className="drop-shadow-md"
                    />

                    {/* Platform Base Lines (Up to 8 platforms at junctions) */}
                    {Array.from({ length: Math.min(st.platforms, 6) }).map((_, pIdx) => (
                      <g key={`pf-${st.id}-${pIdx}`}>
                        <line
                          x1={x - 90}
                          y1={y - 36 + pIdx * 14}
                          x2={x + 90}
                          y2={y - 36 + pIdx * 14}
                          stroke="#e2e8f0"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                        <line
                          x1={x - 90}
                          y1={y - 36 + pIdx * 14}
                          x2={x + 90}
                          y2={y - 36 + pIdx * 14}
                          stroke="#64748b"
                          strokeWidth="2.5"
                          strokeDasharray="2 4"
                          strokeLinecap="round"
                        />
                      </g>
                    ))}

                    {/* Station Name Plate (IR Classic Yellow Board) */}
                    <g transform={`translate(${x - 90}, ${y - 60})`}>
                      <rect
                        width={180}
                        height={26}
                        fill={isMajor ? '#fbbf24' : '#f8fafc'}
                        stroke={isMajor ? '#d97706' : '#94a3b8'}
                        strokeWidth="1.5"
                        rx="6"
                        className="drop-shadow-xs"
                      />
                      <text
                        x={90}
                        y={17}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="11"
                        fontWeight="800"
                        fontFamily="monospace"
                        letterSpacing="0.5"
                      >
                        {st.name.toUpperCase()} ({st.code})
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Render Timetable-Driven Active Trains */}
              {trains.map((train) => {
                const { x, y } = projectToCanvas(train.position.lat, train.position.lng);

                return (
                  <g
                    key={train.id}
                    transform={`translate(${x}, ${y})`}
                  >
                    <RealisticTrainRake
                      train={train as unknown as ActiveGpsTrain}
                      onClick={() => onSelectTrainForWimt(train)}
                    />

                    {/* Live Timetable Floating Callout Pill */}
                    <g transform="translate(25, -40)" className="pointer-events-none">
                      <rect
                        width={160}
                        height={46}
                        fill="rgba(15, 23, 42, 0.92)"
                        rx="8"
                        stroke="#0284c7"
                        strokeWidth="1"
                        className="drop-shadow-lg"
                      />
                      <text x={8} y={16} fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                        {train.name.slice(0, 18)}
                      </text>
                      <text x={8} y={28} fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        {train.currentSpeedKmH} km/h • {train.status === 'DWELLING_AT_STATION' ? 'AT PLATFORM' : 'CRUISING'}
                      </text>
                      <text x={8} y={40} fill="#94a3b8" fontSize="8" fontFamily="monospace">
                        Next: {train.nextStationName}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </TransformComponent>
        <ExtractedTrackControls />
      </TransformWrapper>
    </div>
  );
};
