import { useState, useMemo } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { REAL_TRACK_WAYPOINTS, REAL_STATIONS, GeoStation } from '../../data/realTracksData';
import { useRealGpsTrains, ActiveGpsTrain } from '../../lib/hooks/useRealGpsTrains';
import { Construction, AlertTriangle, CheckCircle2, Navigation2 } from 'lucide-react';

interface ExtractedRealTrackCanvasProps {
  speedMultiplier: number;
  blockActive: boolean;
  onToggleBlock: () => void;
  onSelectTrainForWimt: (train: ActiveGpsTrain) => void;
}

// Projection bounds for Southern Railway Corridor
const MIN_LNG = 79.96;
const MAX_LNG = 80.30;
const MIN_LAT = 12.67;
const MAX_LAT = 13.11;

const CANVAS_W = 4400;
const CANVAS_H = 2600;

// Project (lat, lng) to (canvasX, canvasY)
export const projectToCanvas = (lat: number, lng: number): { x: number; y: number } => {
  // GST corridor runs from South-West (Chengalpattu) to North-East (Chennai Central)
  const normX = (lng - MIN_LNG) / (MAX_LNG - MIN_LNG);
  // Invert Y because higher latitude is further north (top of canvas)
  const normY = 1 - (lat - MIN_LAT) / (MAX_LAT - MIN_LAT);

  // Apply a comfortable padding so tracks aren't right at the edge
  const paddingX = 300;
  const paddingY = 200;

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

// Generate parallel offset path
const createOffsetCanvasPoints = (
  points: { x: number; y: number }[],
  offsetPx: number
): { x: number; y: number }[] => {
  return points.map((p, i) => {
    const next = points[i + 1] || p;
    const prev = points[i - 1] || p;
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    return {
      x: p.x + nx * offsetPx,
      y: p.y + ny * offsetPx
    };
  });
};

const ExtractedTrackControls = ({
  blockActive,
  onToggleBlock
}: {
  blockActive: boolean;
  onToggleBlock: () => void;
}) => {
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
              ? 'ACTIVE BLOCK: TBM ⇄ CMP (AI DIVERSION)'
              : 'INJECT BLOCK: TBM ⇄ CMP'}
          </span>
          {blockActive ? (
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          )}
        </button>
      </div>

      {/* Bottom Floating Station Navigator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 max-w-[95vw] pointer-events-auto select-none font-mono">
        <div className="flex items-center gap-1.5 bg-white/95 p-1.5 rounded-2xl border border-slate-200 shadow-2xl backdrop-blur-md overflow-x-auto max-w-full no-scrollbar">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 border-r border-slate-200 shrink-0">
            STATIONS
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {REAL_STATIONS.map((st) => (
              <button
                key={st.id}
                onClick={() => jumpToStation(st)}
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
              onClick={() => zoomIn(0.2)}
              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => zoomOut(0.2)}
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

export const ExtractedRealTrackCanvas = ({
  speedMultiplier,
  blockActive,
  onToggleBlock,
  onSelectTrainForWimt
}: ExtractedRealTrackCanvasProps) => {
  const trains = useRealGpsTrains(speedMultiplier, blockActive);

  // Project real GPS track waypoints to canvas coordinates
  const canvasWaypoints = useMemo(() => {
    return REAL_TRACK_WAYPOINTS.map((pt) => projectToCanvas(pt.lat, pt.lng));
  }, []);

  // Multi-track offset coordinates
  const upLinePoints = useMemo(() => createOffsetCanvasPoints(canvasWaypoints, -10), [canvasWaypoints]);
  const downLinePoints = useMemo(() => createOffsetCanvasPoints(canvasWaypoints, 10), [canvasWaypoints]);
  const fastLinePoints = useMemo(() => createOffsetCanvasPoints(canvasWaypoints, 28), [canvasWaypoints]);

  const upLinePath = useMemo(() => createSvgPath(upLinePoints), [upLinePoints]);
  const downLinePath = useMemo(() => createSvgPath(downLinePoints), [downLinePoints]);
  const fastLinePath = useMemo(() => createSvgPath(fastLinePoints), [fastLinePoints]);

  // Block path between Tambaram and Chromepet on UP line
  const blockPoints = useMemo(() => upLinePoints.slice(11, 15), [upLinePoints]);
  const blockPath = useMemo(() => createSvgPath(blockPoints), [blockPoints]);

  // Initial focus centered near Tambaram / Chromepet
  const tbmPt = projectToCanvas(12.9256, 80.1171);
  const startX = -tbmPt.x * 0.5 + (typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const startY = -tbmPt.y * 0.5 + (typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#f8fafc]">
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
            {/* Engineering Grid (Subtle clean railway background) */}
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
                <linearGradient id="fast-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              {/* Ballast Beds (Stone trackbed following real curves) */}
              <path d={upLinePath} stroke="#cbd5e1" strokeWidth="28" fill="none" opacity="0.6" strokeLinecap="round" />
              <path d={downLinePath} stroke="#cbd5e1" strokeWidth="28" fill="none" opacity="0.6" strokeLinecap="round" />
              <path d={fastLinePath} stroke="#e2e8f0" strokeWidth="24" fill="none" opacity="0.6" strokeLinecap="round" />

              {/* Concrete Sleepers (Ties) */}
              <path d={upLinePath} stroke="#64748b" strokeWidth="18" strokeDasharray="3 8" fill="none" />
              <path d={downLinePath} stroke="#64748b" strokeWidth="18" strokeDasharray="3 8" fill="none" />
              <path d={fastLinePath} stroke="#64748b" strokeWidth="16" strokeDasharray="3 8" fill="none" />

              {/* Steel Rails */}
              <path d={upLinePath} stroke="#1e293b" strokeWidth="5" fill="none" />
              <path d={upLinePath} stroke="#f8fafc" strokeWidth="2.5" fill="none" />

              <path d={downLinePath} stroke="#1e293b" strokeWidth="5" fill="none" />
              <path d={downLinePath} stroke="#f8fafc" strokeWidth="2.5" fill="none" />

              <path d={fastLinePath} stroke="#d97706" strokeWidth="4.5" fill="none" />
              <path d={fastLinePath} stroke="#fef3c7" strokeWidth="2" fill="none" />

              {/* Maintenance Block Zone (if active) */}
              {blockActive && (
                <g className="animate-pulse">
                  <path d={blockPath} stroke="#ef4444" strokeWidth="32" fill="none" opacity="0.3" strokeLinecap="round" />
                  <path d={blockPath} stroke="#dc2626" strokeWidth="8" strokeDasharray="12 6" fill="none" strokeLinecap="round" />
                </g>
              )}

              {/* Station Hubs & Platforms positioned at their real geographic coordinates */}
              {REAL_STATIONS.map((st) => {
                const { x, y } = projectToCanvas(st.lat, st.lng);
                const isMajor = st.type === 'terminal' || st.type === 'junction';

                return (
                  <g key={st.id} className="select-none">
                    {/* Station Yard Area Box */}
                    <rect
                      x={x - 120}
                      y={y - 55}
                      width={240}
                      height={110}
                      fill="rgba(255, 255, 255, 0.92)"
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                      rx="16"
                      className="drop-shadow-md"
                    />

                    {/* Platform Base Lines */}
                    {Array.from({ length: Math.min(st.platforms, 5) }).map((_, pIdx) => (
                      <g key={`pf-${st.id}-${pIdx}`}>
                        <line
                          x1={x - 80}
                          y1={y - 30 + pIdx * 14}
                          x2={x + 80}
                          y2={y - 30 + pIdx * 14}
                          stroke="#e2e8f0"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                        <line
                          x1={x - 80}
                          y1={y - 30 + pIdx * 14}
                          x2={x + 80}
                          y2={y - 30 + pIdx * 14}
                          stroke="#eab308"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                          opacity="0.9"
                        />
                      </g>
                    ))}

                    {/* Station Name Header Pill */}
                    <rect
                      x={x - 90}
                      y={y - 75}
                      width={180}
                      height={28}
                      fill={isMajor ? '#1e3a8a' : '#ffffff'}
                      stroke={isMajor ? '#1e3a8a' : '#94a3b8'}
                      strokeWidth="1.5"
                      rx="14"
                      className="drop-shadow-sm"
                    />
                    <text
                      x={x}
                      y={y - 56}
                      fill={isMajor ? '#ffffff' : '#0f172a'}
                      fontSize="12"
                      textAnchor="middle"
                      fontWeight="800"
                      className="font-mono tracking-wider"
                    >
                      <tspan fill={isMajor ? '#facc15' : '#2563eb'}>{st.code}</tspan> | {st.name.toUpperCase().slice(0, 12)}
                    </text>

                    {/* Platform Count Badge */}
                    <rect
                      x={x - 30}
                      y={y + 40}
                      width={60}
                      height={18}
                      fill="#f1f5f9"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                      rx="9"
                    />
                    <text
                      x={x}
                      y={y + 53}
                      fill="#475569"
                      fontSize="9"
                      textAnchor="middle"
                      fontWeight="700"
                      className="font-mono"
                    >
                      {st.platforms} PF
                    </text>
                  </g>
                );
              })}

              {/* Moving Trains along the Real Extracted Tracks */}
              {trains.map((train) => {
                const { x, y } = projectToCanvas(train.position.lat, train.position.lng);

                return (
                  <g
                    key={train.id}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      willChange: 'transform'
                    }}
                    onClick={() => onSelectTrainForWimt(train)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing Radar Ring */}
                    <circle r="22" fill={train.color} opacity="0.2" className="animate-ping" />

                    {/* Drop shadow */}
                    <rect x="-40" y="-18" width="80" height="36" fill="rgba(0,0,0,0.15)" rx="10" />

                    {/* Train Container Card */}
                    <rect
                      x="-38"
                      y="-16"
                      width="76"
                      height="32"
                      fill="#ffffff"
                      stroke={train.color}
                      strokeWidth="2"
                      rx="10"
                      className="drop-shadow-md group-hover:scale-110 transition-transform"
                    />

                    {/* Train Icon & Direction Chevron */}
                    <g transform={`translate(-22, 0) rotate(${train.bearing})`}>
                      <circle r="9" fill={train.color} />
                      <Navigation2 className="w-3.5 h-3.5 text-white -translate-x-1.5 -translate-y-1.5 fill-current" />
                    </g>

                    {/* Train Number & Speed Text */}
                    <text x="6" y="-3" fill="#0f172a" fontSize="10" fontWeight="900" className="font-mono">
                      #{train.id}
                    </text>
                    <text x="6" y="9" fill={train.color} fontSize="9" fontWeight="800" className="font-mono">
                      {train.currentSpeedKmH} km/h
                    </text>

                    {/* Tooltip on Hover */}
                    <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <rect x="-80" y="-45" width="160" height="22" fill="#0f172a" rx="6" />
                      <text x="0" y="-31" fill="#ffffff" fontSize="9" textAnchor="middle" fontWeight="700" className="font-mono">
                        {train.name} • CLICK TO TRACK
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </TransformComponent>

        {/* Floating Controls */}
        <ExtractedTrackControls blockActive={blockActive} onToggleBlock={onToggleBlock} />
      </TransformWrapper>
    </div>
  );
};
