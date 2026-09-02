import React, { useState, useRef, useMemo } from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import { TrackSegment, StationNode } from '../../types/railway';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';

export const DigitalTwinCanvas: React.FC = () => {
  const {
    stations,
    tracks,
    trains,
    signals,
    workerCrews,
    toggleTrackBlock,
    selectTrain,
    selectTrack,
    selectStation,
    selectCrew,
    selectedTrain,
    selectedTrack,
  } = useRailwaySimulation();

  // Canvas pan & zoom state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer filters
  const [showSignals, setShowSignals] = useState<boolean>(true);
  const [showWorkers, setShowWorkers] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);

  // Hovered track info
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);

  // SVG viewport dimensions
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if left click and not clicking on interactive node
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Station coordinate map for fast path calculation
  const stationMap = useMemo(() => {
    const map = new Map<string, StationNode>();
    stations.forEach(st => map.set(st.id, st));
    return map;
  }, [stations]);

  // Calculate track Y coordinate based on line type
  const getTrackY = (lineType: TrackSegment['lineType']) => {
    switch (lineType) {
      case 'UP_MAIN':
        return 230;
      case 'DOWN_MAIN':
        return 260;
      case 'FAST_LINE':
        return 290;
      case 'LOOP_PLATFORM':
        return 200;
      case 'YARD_LINE':
        return 320;
      default:
        return 260;
    }
  };

  // Preset zoom viewpoints
  const resetToFullCorridor = () => {
    setZoom(0.85);
    setPan({ x: 20, y: 50 });
  };

  const zoomToStation = (stationId: string) => {
    const st = stationMap.get(stationId);
    if (!st) return;
    setZoom(1.5);
    setPan({ x: -(st.canvasX * 1.5) + 600, y: -100 });
  };

  return (
    <div className="relative w-full h-[calc(100vh-108px)] bg-[#050811] overflow-hidden select-none cursor-grab active:cursor-grabbing">
      {/* Background Cybernetic Spatial Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(30, 58, 138, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30, 58, 138, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating Canvas Quick Controls (Zoom, Pan, Layer Toggles) */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-2xl">
        <button
          onClick={() => setZoom(z => Math.min(2.5, +(z + 0.15).toFixed(2)))}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(0.6, +(z - 0.15).toFixed(2)))}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetToFullCorridor}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          title="Fit Corridor View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        {/* Station Jump Selector */}
        <div className="flex items-center gap-1">
          {stations.map(st => (
            <button
              key={st.id}
              onClick={() => zoomToStation(st.id)}
              className="px-2 py-1 text-[11px] font-mono rounded bg-slate-800/80 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-slate-700 transition-colors"
            >
              {st.code}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-slate-700 mx-1" />

        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setShowSignals(s => !s)}
            className={`px-2 py-1 rounded text-[11px] border transition-colors ${
              showSignals
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-slate-800/50 text-slate-500 border-slate-800'
            }`}
          >
            Signals
          </button>
          <button
            onClick={() => setShowWorkers(w => !w)}
            className={`px-2 py-1 rounded text-[11px] border transition-colors ${
              showWorkers
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-slate-800/50 text-slate-500 border-slate-800'
            }`}
          >
            Rakshak Gangs
          </button>
          <button
            onClick={() => setShowLabels(l => !l)}
            className={`px-2 py-1 rounded text-[11px] border transition-colors ${
              showLabels
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : 'bg-slate-800/50 text-slate-500 border-slate-800'
            }`}
          >
            Labels
          </button>
        </div>
      </div>

      {/* Floating Legend Badge */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 flex flex-wrap items-center gap-4 shadow-xl">
        <span className="font-bold text-slate-200 uppercase text-[10px] tracking-wider">TRACK STATUS:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
          <span>Clear Line</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
          <span className="text-red-300 font-bold">Maintenance Block</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" />
          <span>Caution Zone (30 km/h)</span>
        </div>
      </div>

      {/* Interactive SVG Railway Digital Twin Map */}
      <svg
        ref={svgRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full"
      >
        <defs>
          {/* Neon Track Glow Filters */}
          <filter id="cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="hazard-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Diagonal Hazard Stripes for Blocked Tracks */}
          <pattern id="hazardStripes" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="16" stroke="#eab308" strokeWidth="8" />
            <line x1="8" y1="0" x2="8" y2="16" stroke="#1e293b" strokeWidth="8" />
          </pattern>
        </defs>

        {/* Scalable & Pannable Master Group */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. Track Infrastructure Lines */}
          {tracks.map(track => {
            const fromSt = stationMap.get(track.fromStationId);
            const toSt = stationMap.get(track.toStationId);
            if (!fromSt || !toSt) return null;

            const yPos = getTrackY(track.lineType);
            const isHovered = hoveredTrackId === track.id;
            const isSelected = selectedTrack?.id === track.id;
            const isBlocked = track.status === 'MAINTENANCE_BLOCKED';
            const isCaution = track.status === 'CAUTION_RESTRICTED';

            let trackStroke = '#38bdf8'; // Clear cyan
            let trackWidth = 4;
            let filter = 'url(#cyan-glow)';

            if (isBlocked) {
              trackStroke = '#ef4444'; // Red block
              trackWidth = 6;
              filter = 'url(#hazard-glow)';
            } else if (isCaution) {
              trackStroke = '#f59e0b'; // Amber caution
              trackWidth = 5;
            } else if (track.status === 'OCCUPIED') {
              trackStroke = '#3b82f6'; // Deep blue active
              trackWidth = 4.5;
            }

            return (
              <g
                key={track.id}
                className="cursor-pointer transition-opacity"
                onMouseEnter={() => setHoveredTrackId(track.id)}
                onMouseLeave={() => setHoveredTrackId(null)}
                onClick={() => {
                  selectTrack(track);
                  toggleTrackBlock(track.id);
                }}
              >
                {/* Railroad Sleeper Ties Background */}
                <line
                  x1={fromSt.canvasX}
                  y1={yPos}
                  x2={toSt.canvasX}
                  y2={yPos}
                  stroke="#334155"
                  strokeWidth={14}
                  strokeDasharray="2 6"
                  strokeLinecap="butt"
                />

                {/* Main Steel Rail Line */}
                <line
                  x1={fromSt.canvasX}
                  y1={yPos}
                  x2={toSt.canvasX}
                  y2={yPos}
                  stroke={trackStroke}
                  strokeWidth={trackWidth}
                  filter={filter}
                  strokeLinecap="round"
                />

                {/* Hazard Stripe Overlay if Blocked */}
                {isBlocked && (
                  <line
                    x1={fromSt.canvasX}
                    y1={yPos}
                    x2={toSt.canvasX}
                    y2={yPos}
                    stroke="url(#hazardStripes)"
                    strokeWidth={8}
                    strokeLinecap="round"
                    className="animate-pulse opacity-90"
                  />
                )}

                {/* Track ID & Speed Limit Tag on Hover */}
                {(isHovered || isSelected || isBlocked) && (
                  <g transform={`translate(${(fromSt.canvasX + toSt.canvasX) / 2}, ${yPos - 12})`}>
                    <rect
                      x="-70"
                      y="-12"
                      width="140"
                      height="24"
                      rx="6"
                      fill="#0f172a"
                      stroke={isBlocked ? '#ef4444' : '#38bdf8'}
                      strokeWidth="1.5"
                      className="shadow-lg"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={isBlocked ? '#fca5a5' : '#e2e8f0'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {isBlocked ? '⚠️ BLOCK: 0 km/h' : `${track.id.split('-')[3] || 'TRACK'} • ${track.currentSpeedLimitKmh} km/h`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* 2. Signals along Corridor */}
          {showSignals &&
            signals.map(signal => {
              const aspectColor =
                signal.aspect === 'GREEN'
                  ? '#10b981'
                  : signal.aspect === 'RED'
                  ? '#ef4444'
                  : signal.aspect === 'DOUBLE_YELLOW'
                  ? '#f59e0b'
                  : '#facc15';

              return (
                <g key={signal.id} transform={`translate(${signal.canvasX}, ${signal.canvasY - 14})`}>
                  {/* Signal Mast Post */}
                  <line x1="0" y1="0" x2="0" y2="14" stroke="#64748b" strokeWidth="2" />
                  {/* Signal Head Box */}
                  <rect x="-4" y="-12" width="8" height="12" rx="2" fill="#0f172a" stroke="#475569" strokeWidth="1" />
                  {/* Aspect Lamp with Glow */}
                  <circle cx="0" cy="-6" r="3.5" fill={aspectColor} className="animate-pulse" />
                </g>
              );
            })}

          {/* 3. Station Platform Nodes & Hubs */}
          {stations.map(station => {
            const isTambaram = station.code === 'TBM';
            const isCentral = station.code === 'MS';

            return (
              <g
                key={station.id}
                transform={`translate(${station.canvasX}, ${station.canvasY})`}
                className="cursor-pointer"
                onClick={() => selectStation(station)}
              >
                {/* Station Pillar Line */}
                <line x1="0" y1="-70" x2="0" y2="70" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />

                {/* Station Hub Box */}
                <rect
                  x="-35"
                  y="-18"
                  width="70"
                  height="36"
                  rx="8"
                  fill="#0b1329"
                  stroke={isTambaram || isCentral ? '#3b82f6' : '#64748b'}
                  strokeWidth="2"
                  className="shadow-xl"
                />

                {/* Station Code */}
                <text x="0" y="-1" textAnchor="middle" fill="#ffffff" fontSize="12" fontFamily="monospace" fontWeight="bold">
                  {station.code}
                </text>

                {/* Station Name Board Badge */}
                {showLabels && (
                  <g transform="translate(0, 36)">
                    <rect x="-65" y="-10" width="130" height="20" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                    <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontFamily="sans-serif">
                      {station.name.length > 18 ? station.name.slice(0, 16) + '...' : station.name}
                    </text>
                  </g>
                )}

                {/* Platform Track Nodes */}
                {station.platforms.map(pf => (
                  <circle
                    key={pf.id}
                    cx="0"
                    cy={pf.trackYOffset * 0.7}
                    r="3"
                    fill={pf.isOccupied ? '#f59e0b' : '#38bdf8'}
                    opacity="0.8"
                  />
                ))}
              </g>
            );
          })}

          {/* 4. Field Worker Crews ("Rakshak" Safety System) */}
          {showWorkers &&
            workerCrews.map(crew => {
              const isCritical = crew.warningStatus === 'CRITICAL_ALERT';
              const isCaution = crew.warningStatus === 'CAUTION';

              return (
                <g
                  key={crew.id}
                  transform={`translate(${crew.canvasX}, ${crew.canvasY})`}
                  className="cursor-pointer"
                  onClick={() => selectCrew(crew)}
                >
                  {/* Geofence Radar Circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r={crew.geofenceRadiusMeters * 0.08}
                    fill={isCritical ? 'rgba(239,68,68,0.2)' : isCaution ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.1)'}
                    stroke={isCritical ? '#ef4444' : isCaution ? '#f59e0b' : '#3b82f6'}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className={isCritical ? 'animate-ping' : ''}
                  />

                  {/* Hard Hat Marker Pin */}
                  <circle
                    cx="0"
                    cy="0"
                    r="9"
                    fill={isCritical ? '#ef4444' : isCaution ? '#f59e0b' : '#2563eb'}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Worker Icon */}
                  <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    👷
                  </text>

                  {/* Proximity Warning Flag */}
                  {(isCritical || isCaution) && (
                    <g transform="translate(0, -18)">
                      <rect x="-45" y="-9" width="90" height="18" rx="4" fill="#ef4444" className="animate-pulse" />
                      <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        ⚠️ {crew.nearestTrainDistanceMeters}m
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

          {/* 5. Live Moving Trains */}
          {trains.map(train => {
            const currentTrack = tracks.find(t => t.id === train.currentTrackId);
            if (!currentTrack) return null;

            const fromSt = stationMap.get(currentTrack.fromStationId);
            const toSt = stationMap.get(currentTrack.toStationId);
            if (!fromSt || !toSt) return null;

            const trackY = getTrackY(currentTrack.lineType);

            // Calculate exact position based on direction and progressRatio
            let trainX =
              train.direction === 'UP'
                ? fromSt.canvasX + (toSt.canvasX - fromSt.canvasX) * train.progressRatio
                : toSt.canvasX - (toSt.canvasX - fromSt.canvasX) * train.progressRatio;

            const isSelected = selectedTrain?.id === train.id;

            // Train badge styling based on type
            let badgeBg = '#3b82f6';
            let glowFilter = 'drop-shadow(0 0 8px rgba(59,130,246,0.8))';
            if (train.type === 'VANDE_BHARAT') {
              badgeBg = '#0284c7';
              glowFilter = 'drop-shadow(0 0 12px rgba(2,132,199,0.9))';
            } else if (train.type === 'SUPERFAST') {
              badgeBg = '#e11d48';
              glowFilter = 'drop-shadow(0 0 10px rgba(225,29,72,0.8))';
            } else if (train.type === 'FREIGHT') {
              badgeBg = '#7c3aed';
              glowFilter = 'drop-shadow(0 0 8px rgba(124,58,237,0.7))';
            }

            return (
              <g
                key={train.id}
                transform={`translate(${trainX}, ${trackY})`}
                className="cursor-pointer transition-transform"
                style={{ filter: glowFilter }}
                onClick={() => selectTrain(train)}
              >
                {/* Direction Halo Ring */}
                <circle cx="0" cy="0" r={isSelected ? 16 : 13} fill="none" stroke={badgeBg} strokeWidth="2" strokeDasharray="3 3" />

                {/* Train Rake Body */}
                <rect
                  x="-20"
                  y="-10"
                  width="40"
                  height="20"
                  rx="6"
                  fill={badgeBg}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className={isSelected ? 'ring-2 ring-white ring-offset-2' : ''}
                />

                {/* Direction Chevron Arrow */}
                <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  {train.direction === 'UP' ? '▶' : '◀'}
                </text>

                {/* Floating Telemetry Badge on Train */}
                <g transform="translate(0, -22)">
                  <rect
                    x="-45"
                    y="-10"
                    width="90"
                    height="20"
                    rx="4"
                    fill="#0f172a"
                    stroke={isSelected ? '#38bdf8' : '#334155'}
                    strokeWidth="1.2"
                  />
                  <text x="0" y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                    {train.number} • {train.currentSpeedKmh}k
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
