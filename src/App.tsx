import React from 'react';
import { RailwaySimulationProvider, useRailwaySimulation } from './context/RailwaySimulationContext';
import { CommandHeader } from './components/layout/CommandHeader';
import { ViewNavigation } from './components/layout/ViewNavigation';
import { DigitalTwinCanvas } from './components/map/DigitalTwinCanvas';
import { TrainTelemetryModal } from './components/inspection/TrainTelemetryModal';
import { TrackBlockInspector } from './components/inspection/TrackBlockInspector';
import { AIBlockPlanner } from './components/planner/AIBlockPlanner';
import { WorkerSafetyHub } from './components/safety/WorkerSafetyHub';
import { VoiceDispatchConsole } from './components/dispatch/VoiceDispatchConsole';
import { RailMindAssistant } from './components/ai/RailMindAssistant';
import { HackathonPitchDeck } from './components/presentation/HackathonPitchDeck';
import { AlertTriangle } from 'lucide-react';

const MainViewContent: React.FC = () => {
  const { activeView, activeEmergencyBrake } = useRailwaySimulation();

  return (
    <main className="relative flex-1 flex flex-col overflow-hidden bg-[#040711]">
      {/* Emergency Brake Warning Banner */}
      {activeEmergencyBrake && (
        <div className="w-full bg-red-600 text-white py-1.5 px-4 text-center text-xs font-mono font-bold flex items-center justify-center gap-2 animate-pulse z-50">
          <AlertTriangle className="w-4 h-4" />
          <span>KAVACH EMERGENCY BRAKE ACTIVE • ALL ACTIVE TRAIN MOVEMENTS HALTED ACROSS SECTION</span>
        </div>
      )}

      {/* View Switcher */}
      {activeView === 'MAP' && (
        <div className="relative w-full h-full">
          <DigitalTwinCanvas />
          <TrackBlockInspector />
        </div>
      )}

      {activeView === 'PLANNER' && <AIBlockPlanner />}
      {activeView === 'WORKERS' && <WorkerSafetyHub />}
      {activeView === 'DISPATCH' && <VoiceDispatchConsole />}
      {activeView === 'AI_COPILOT' && <RailMindAssistant />}
      {activeView === 'PITCH_DECK' && <HackathonPitchDeck />}

      {/* Global Telemetry Modals */}
      <TrainTelemetryModal />
    </main>
  );
};

export function App() {
  return (
    <RailwaySimulationProvider>
      <div className="min-h-screen w-full flex flex-col bg-[#040711] text-slate-100 antialiased select-none font-sans">
        <CommandHeader />
        <ViewNavigation />
        <MainViewContent />
      </div>
    </RailwaySimulationProvider>
  );
}

export default App;
