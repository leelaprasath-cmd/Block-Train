import { useState } from 'react';
import { RailwaySimulationProvider } from './context/RailwaySimulationContext';
import { RealSatelliteMap } from './components/map/RealSatelliteMap';
import { ExtractedRealTrackCanvas } from './components/map/ExtractedRealTrackCanvas';
import { AIBlockPlanner } from './components/planner/AIBlockPlanner';
import { DashboardHUD } from './components/ui/DashboardHUD';
import { SpeedController } from './components/ui/SpeedController';
import { WhereIsMyTrainDrawer } from './components/wimt/WhereIsMyTrainDrawer';
import { useClock } from './lib/hooks/useClock';
import { DEFAULT_SPEED_MULTIPLIER } from './lib/constants';
import { Satellite, Compass, Train as TrainIcon, Sparkles } from 'lucide-react';

function AppContent() {
  // Mode: 'satellite' (Default: Real-World Satellite GIS Track Map) or 'real_track' (Pure Real-World Surveyed Track Geometry)
  const [mode, setMode] = useState<'satellite' | 'real_track'>('satellite');
  const [speedMultiplier, setSpeedMultiplier] = useState(DEFAULT_SPEED_MULTIPLIER);
  const [blockActive, setBlockActive] = useState(false);
  const [plannerOpen, setPlannerOpen] = useState(false);

  // Where Is My Train Drawer state
  const [wimtOpen, setWimtOpen] = useState(false);
  const [selectedTrainNum, setSelectedTrainNum] = useState('20643');
  const [selectedTrainSpeed, setSelectedTrainSpeed] = useState(128);

  const time = useClock();

  const handleSelectTrainForWimt = (trainId: string, speedKmH: number) => {
    setSelectedTrainNum(trainId);
    setSelectedTrainSpeed(speedKmH);
    setWimtOpen(true);
  };

  const handleBlockAuthorized = (_sectionId: string) => {
    setBlockActive(true);
  };

  return (
    <div className="w-full h-screen bg-[#0f172a] overflow-hidden relative font-sans text-slate-800 selection:bg-blue-500/20 select-none railway-cursor">
      {/* Primary Real-World Map Viewport (NO SCHEMATIC - 100% Real World Track) */}
      {mode === 'satellite' ? (
        <RealSatelliteMap
          speedMultiplier={speedMultiplier}
          blockActive={blockActive}
          onToggleBlock={() => setBlockActive(!blockActive)}
          onSelectTrainWimt={handleSelectTrainForWimt}
        />
      ) : (
        <ExtractedRealTrackCanvas
          speedMultiplier={speedMultiplier}
          blockActive={blockActive}
          onToggleBlock={() => setBlockActive(!blockActive)}
          onSelectTrainForWimt={(train) => handleSelectTrainForWimt(train.id, train.currentSpeedKmH)}
        />
      )}

      {/* Floating Executive Dashboard HUD */}
      <DashboardHUD time={time} />

      {/* Top Right Floating Navigation Bar */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-2.5 pointer-events-auto flex-wrap justify-end">
        {/* AI Block Planner Button (Neon PostgreSQL + OR-Tools Optimizer) */}
        <button
          onClick={() => setPlannerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold shadow-lg backdrop-blur-md border bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border-blue-400 transition-all ring-2 ring-blue-400/30"
          title="Open AI Block Planning Engine (Neon DB + Google OR-Tools + Scikit-Learn)"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>AI Block Planner</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/20 font-sans font-black">NEON DB</span>
        </button>

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

        {/* Real-World View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-slate-200/90 backdrop-blur-md shadow-lg font-mono">
          <button
            onClick={() => setMode('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'satellite'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Real-World Satellite GIS with Surveyed Railway Tracks & Crossovers"
          >
            <Satellite className="w-3.5 h-3.5 text-amber-300" />
            <span>Real Satellite GIS</span>
          </button>

          <button
            onClick={() => setMode('real_track')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'real_track'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Real-World Track Geometry (Ballast, Ties, Realistic Multi-Coach Trains)"
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>Real Track Twin</span>
          </button>
        </div>

        {/* Sim Speed Controller */}
        <SpeedController speed={speedMultiplier} setSpeed={setSpeedMultiplier} />
      </div>

      {/* Full-Screen AI Block Planner Overlay (Neon DB + Google OR-Tools) */}
      {plannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col animate-in fade-in duration-200">
          <AIBlockPlanner
            onBlockAuthorized={handleBlockAuthorized}
            onClose={() => setPlannerOpen(false)}
          />
        </div>
      )}

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

export default function App() {
  return (
    <RailwaySimulationProvider>
      <AppContent />
    </RailwaySimulationProvider>
  );
}
