import { useState } from 'react';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { StaticInfrastructure } from '../track/StaticInfrastructure';
import { LiveTrains } from '../train/LiveTrains';
import { Train } from '../../lib/types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, STATIONS } from '../../lib/stations';
import { STATION_SPACING, CENTER_Y } from '../../lib/constants';

const StationNavigator = () => {
  const { setTransform, zoomIn, zoomOut, resetTransform } = useControls();
  const [activeStation, setActiveStation] = useState<string>('CGL');

  const jumpToStation = (station: typeof STATIONS[0], index: number) => {
    setActiveStation(station.id);
    const sX = 600 + index * STATION_SPACING;
    const sY = CENTER_Y + station.yOffset;
    const scale = 0.55;
    const targetX = -sX * scale + window.innerWidth / 2;
    const targetY = -sY * scale + window.innerHeight / 2;
    setTransform(targetX, targetY, scale, 500, 'easeOut');
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-[95vw] pointer-events-auto select-none">
      <div className="flex items-center gap-1.5 bg-white/95 p-1.5 rounded-2xl border border-slate-200/90 backdrop-blur-md shadow-xl overflow-x-auto max-w-full no-scrollbar">
        <div className="text-slate-400 font-mono text-[10px] font-bold uppercase tracking-wider px-2 border-r border-slate-200 shrink-0">
          STATIONS
        </div>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {STATIONS.map((st, i) => (
            <button
              key={st.id}
              onClick={() => jumpToStation(st, i)}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg transition-all shrink-0 ${
                activeStation === st.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={`${st.id}: ${st.name}`}
            >
              {st.id}
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
            className="px-2 h-7 flex items-center justify-center text-[10px] font-mono font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors uppercase"
            title="Reset View"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export const DigitalTwinMap = ({ trains }: { trains: Train[] }) => {
  // Focus on first major station on load
  const startX = -600;
  const startY = -400;

  return (
    <TransformWrapper
      key="map-wrapper-bright-v1" 
      initialScale={0.45}   
      initialPositionX={startX}
      initialPositionY={startY}
      minScale={0.2}
      maxScale={5}
      limitToBounds={false}
      wheel={{ step: 0.1 }}
      panning={{ velocityDisabled: true }}
    >
      <TransformComponent wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }}>
        <div className="relative bg-[#f8fafc]" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
          
          {/* Bright Technical Grid */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)', 
              backgroundSize: '100px 100px' 
            }} 
          />
          {/* Center Axis Guideline */}
          <div className="absolute top-[800px] left-0 w-full h-[1px] bg-blue-500/20 pointer-events-none" />
          
          <svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block drop-shadow-sm">
            <defs>
              <linearGradient id="headlight-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="metal-express" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="50%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
              <linearGradient id="metal-passenger" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="25%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="75%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="metal-freight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
            </defs>
            
            <StaticInfrastructure />
            <LiveTrains trains={trains} />
          </svg>
        </div>
      </TransformComponent>

      {/* Station Navigation Floating Bar */}
      <StationNavigator />
    </TransformWrapper>
  );
};
