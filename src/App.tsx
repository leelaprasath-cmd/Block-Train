import { useState } from 'react';
import { DigitalTwinMap } from './components/map/DigitalTwinMap';
import { RealSatelliteMap } from './components/map/RealSatelliteMap';
import { DashboardHUD } from './components/ui/DashboardHUD';
import { SpeedController } from './components/ui/SpeedController';
import { useClock } from './lib/hooks/useClock';
import { useTrainPhysics } from './lib/hooks/useTrainPhysics';
import { DEFAULT_SPEED_MULTIPLIER } from './lib/constants';
import { Map as MapIcon, Satellite } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'satellite' | 'schematic'>('satellite');
  const [speedMultiplier, setSpeedMultiplier] = useState(DEFAULT_SPEED_MULTIPLIER);
  const [blockActive, setBlockActive] = useState(false);
  const time = useClock();
  const trains = useTrainPhysics(speedMultiplier);

  return (
    <div className="w-full h-screen bg-[#f8fafc] overflow-hidden relative font-sans text-slate-800 selection:bg-blue-500/20 select-none">
      {/* Primary Map Surface */}
      {mode === 'schematic' ? (
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

      {/* Top Right Floating Controls Bar */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-2.5 pointer-events-auto">
        {/* Mode Switcher Pill */}
        <div className="flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-slate-200/90 backdrop-blur-md shadow-lg font-mono">
          <button
            onClick={() => setMode('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'satellite'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Satellite className="w-3.5 h-3.5 text-amber-300" />
            <span>Real Satellite GIS</span>
          </button>
          <button
            onClick={() => setMode('schematic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'schematic'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Vector Schematic</span>
          </button>
        </div>

        {/* Sim Speed Controller */}
        <SpeedController speed={speedMultiplier} setSpeed={setSpeedMultiplier} />
      </div>
    </div>
  );
}
