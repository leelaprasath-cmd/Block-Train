import { useState } from 'react';
import { ExtractedRealTrackCanvas } from './components/map/ExtractedRealTrackCanvas';
import { DigitalTwinMap } from './components/map/DigitalTwinMap';
import { RealSatelliteMap } from './components/map/RealSatelliteMap';
import { DashboardHUD } from './components/ui/DashboardHUD';
import { SpeedController } from './components/ui/SpeedController';
import { WhereIsMyTrainDrawer } from './components/wimt/WhereIsMyTrainDrawer';
import { useClock } from './lib/hooks/useClock';
import { useTrainPhysics } from './lib/hooks/useTrainPhysics';
import { DEFAULT_SPEED_MULTIPLIER } from './lib/constants';
import { ActiveGpsTrain } from './lib/hooks/useRealGpsTrains';
import { Compass, Satellite, Train as TrainIcon, Layers } from 'lucide-react';

export default function App() {
  // Modes: 'extracted' (Pure Real Railway Tracks - NO City Map), 'schematic' (Vector diagram), 'satellite' (Google Earth)
  const [mode, setMode] = useState<'extracted' | 'schematic' | 'satellite'>('extracted');
  const [speedMultiplier, setSpeedMultiplier] = useState(DEFAULT_SPEED_MULTIPLIER);
  const [blockActive, setBlockActive] = useState(false);

  // Where Is My Train Drawer state
  const [wimtOpen, setWimtOpen] = useState(false);
  const [selectedTrainNum, setSelectedTrainNum] = useState('20643');
  const [selectedTrainSpeed, setSelectedTrainSpeed] = useState(128);

  const time = useClock();
  const trains = useTrainPhysics(speedMultiplier);

  const handleSelectTrainForWimt = (train: ActiveGpsTrain) => {
    setSelectedTrainNum(train.id);
    setSelectedTrainSpeed(train.currentSpeedKmH);
    setWimtOpen(true);
  };

  return (
    <div className="w-full h-screen bg-[#f8fafc] overflow-hidden relative font-sans text-slate-800 selection:bg-blue-500/20 select-none">
      {/* Primary Map Viewport */}
      {mode === 'extracted' ? (
        <ExtractedRealTrackCanvas
          speedMultiplier={speedMultiplier}
          blockActive={blockActive}
          onToggleBlock={() => setBlockActive(!blockActive)}
          onSelectTrainForWimt={handleSelectTrainForWimt}
        />
      ) : mode === 'schematic' ? (
        <DigitalTwinMap trains={trains} />
      ) : (
        <RealSatelliteMap
          speedMultiplier={speedMultiplier}
          blockActive={blockActive}
          onToggleBlock={() => setBlockActive(!blockActive)}
        />
      )}

      {/* Floating Executive Dashboard HUD */}
      <DashboardHUD time={time} />

      {/* Top Right Floating Navigation Bar */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-2.5 pointer-events-auto flex-wrap justify-end">
        {/* "Where Is My Train" Live Schedule Button */}
        <button
          onClick={() => setWimtOpen(!wimtOpen)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold shadow-lg backdrop-blur-md border transition-all ${
            wimtOpen
              ? 'bg-[#1e3a8a] text-white border-blue-600 ring-2 ring-blue-400/40'
              : 'bg-white/95 text-slate-800 border-slate-200 hover:border-blue-300 hover:text-blue-700'
          }`}
          title="Open Indian Railways Live NTES Timetable & Running Status"
        >
          <TrainIcon className="w-4 h-4 text-amber-500" />
          <span>Where Is My Train</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-slate-200/90 backdrop-blur-md shadow-lg font-mono">
          <button
            onClick={() => setMode('extracted')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'extracted'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Real-World Railway Track Geometry (Pure Tracks, No City Map)"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>Real Tracks (No Map)</span>
          </button>

          <button
            onClick={() => setMode('schematic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'schematic'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Schematic Yard Diagram"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Schematic</span>
          </button>

          <button
            onClick={() => setMode('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'satellite'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Google Earth Satellite Imagery"
          >
            <Satellite className="w-3.5 h-3.5 text-amber-300" />
            <span>Satellite GIS</span>
          </button>
        </div>

        {/* Sim Speed Controller */}
        <SpeedController speed={speedMultiplier} setSpeed={setSpeedMultiplier} />
      </div>

      {/* "Where Is My Train" Live Schedule & Telemetry Drawer */}
      <WhereIsMyTrainDrawer
        isOpen={wimtOpen}
        onClose={() => setWimtOpen(false)}
        selectedTrainNumber={selectedTrainNum}
        onSelectTrainNumber={(num) => setSelectedTrainNum(num)}
        liveSpeedKmH={selectedTrainSpeed}
      />
    </div>
  );
}
