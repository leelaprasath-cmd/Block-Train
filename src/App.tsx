import { useState } from 'react';
import { RailwaySimulationProvider } from './context/RailwaySimulationContext';
import { RealSatelliteMap } from './components/map/RealSatelliteMap';
import { ExtractedRealTrackCanvas } from './components/map/ExtractedRealTrackCanvas';
import { SpatialRailway3D } from './components/threeui/SpatialRailway3D';
import { AIBlockPlanner } from './components/planner/AIBlockPlanner';
import { UnifiedOCCHeader } from './components/layout/UnifiedOCCHeader';
import { WhereIsMyTrainDrawer } from './components/wimt/WhereIsMyTrainDrawer';
import { useClock } from './lib/hooks/useClock';
import { DEFAULT_SPEED_MULTIPLIER } from './lib/constants';

function AppContent() {
  // Mode: 'spatial_3d' (ThreeUI 3D WebGL Digital Twin) | 'satellite' (Satellite GIS) | 'real_track' (Surveyed Track Vector)
  const [mode, setMode] = useState<'spatial_3d' | 'satellite' | 'real_track'>('spatial_3d');
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
    <div className="w-full h-screen bg-slate-50 overflow-hidden relative font-sans text-slate-900 selection:bg-blue-500/20 select-none railway-cursor">
      {/* 1. Top Executive OCC Operations Command Bar */}
      <UnifiedOCCHeader
        simulatedTime={time}
        mode={mode}
        onToggleMode={setMode}
        speedMultiplier={speedMultiplier}
        onSetSpeed={setSpeedMultiplier}
        blockActive={blockActive}
        onToggleBlock={() => setBlockActive(!blockActive)}
        onOpenPlanner={() => setPlannerOpen(true)}
        onToggleWimt={() => setWimtOpen(!wimtOpen)}
        isWimtOpen={wimtOpen}
      />

      {/* 2. Primary High-Tech Viewport (Fills screen below the 64px header) */}
      <main className="w-full h-[calc(100vh-64px)] mt-16 relative bg-slate-900">
        {mode === 'spatial_3d' ? (
          <SpatialRailway3D
            speedMultiplier={speedMultiplier}
            blockActive={blockActive}
            onToggleBlock={() => setBlockActive(!blockActive)}
            onSelectTrainWimt={handleSelectTrainForWimt}
          />
        ) : mode === 'satellite' ? (
          <RealSatelliteMap
            speedMultiplier={speedMultiplier}
            blockActive={blockActive}
            onSelectTrainWimt={handleSelectTrainForWimt}
          />
        ) : (
          <ExtractedRealTrackCanvas
            speedMultiplier={speedMultiplier}
            blockActive={blockActive}
            onSelectTrainForWimt={(train) => handleSelectTrainForWimt(train.id, train.currentSpeedKmH)}
          />
        )}
      </main>

      {/* 3. Full-Screen AI Block Planner Overlay (Neon DB + Google OR-Tools) */}
      {plannerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          <AIBlockPlanner
            onBlockAuthorized={handleBlockAuthorized}
            onClose={() => setPlannerOpen(false)}
          />
        </div>
      )}

      {/* 4. "Where Is My Train" Live Schedule & Telemetry Drawer */}
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
