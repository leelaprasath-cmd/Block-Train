import React from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import {
  ShieldAlert,
  HardHat,
  Radio,
  AlertTriangle,
  Battery,
  MapPin,
  Users,
  Compass,
  PhoneCall,
} from 'lucide-react';

export const WorkerSafetyHub: React.FC = () => {
  const {
    workerCrews,
    triggerEmergencyBrake,
    broadcastRadioMessage,
    activeEmergencyBrake,
    resetEmergencyBrake,
  } = useRailwaySimulation();

  const handleBroadcastGangAlert = (gangName: string) => {
    broadcastRadioMessage(
      `PRIORITY SAFETY CALL: ${gangName}, train approaching on adjacent track! Clear line of sight and acknowledge!`,
      'CHANNEL_3_GANG',
      'Safety Desk MAS'
    );
  };

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-[#060a15] text-slate-200 p-4 lg:p-8 font-mono overflow-y-auto">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <ShieldAlert className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                RAKSHAK TRACK WORKER SAFETY & GEOFENCE RADAR
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Real-time IoT geofencing, GPS proximity alert system, and autonomous Kavach collision protection for field maintenance gangs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeEmergencyBrake ? (
              <button
                onClick={resetEmergencyBrake}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                RESET EMERGENCY BRAKE
              </button>
            ) : (
              <button
                onClick={() => triggerEmergencyBrake()}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" />
                TRIGGER ALL-SECTION SOS STOP
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gang Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {workerCrews.map(crew => {
          const isCritical = crew.warningStatus === 'CRITICAL_ALERT';
          const isCaution = crew.warningStatus === 'CAUTION';

          return (
            <div
              key={crew.id}
              className={`p-6 rounded-2xl border transition-all ${
                isCritical
                  ? 'bg-red-950/30 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.25)] animate-pulse'
                  : isCaution
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'bg-[#0b1222] border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">{crew.gangNumber}</h4>
                    <span className="text-xs text-slate-400 font-sans">{crew.leadSupervisor}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    isCritical
                      ? 'bg-red-500 text-white animate-bounce'
                      : isCaution
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {crew.warningStatus}
                </span>
              </div>

              {/* Work Description */}
              <p className="text-xs text-slate-300 font-sans mb-4 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
                {crew.workDescription}
              </p>

              {/* Proximity Telemetry */}
              <div className="space-y-2 text-xs mb-5 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" /> NEAREST TRAIN:
                  </span>
                  <span className={`font-bold ${isCritical ? 'text-red-400 text-sm' : isCaution ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {crew.nearestTrainDistanceMeters} Meters
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> SECTION LOCATION:
                  </span>
                  <span className="text-white truncate max-w-[170px]">{crew.currentLocationSection}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> CREW STRENGTH:
                  </span>
                  <span className="text-slate-200">{crew.crewSize} Maintainers</span>
                </div>

                <div className="flex justify-between py-1 items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" /> IOT RADAR BATTERY:
                  </span>
                  <span className="text-emerald-300 font-bold">{crew.batteryLevel}%</span>
                </div>
              </div>

              {/* Interactive Dispatch Alert Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleBroadcastGangAlert(crew.gangNumber)}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>TRANSMIT AUDIO PROXIMITY ALERT</span>
                </button>

                <button
                  onClick={() => triggerEmergencyBrake()}
                  className="w-full py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>GANG SOS KAVACH STOP</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
