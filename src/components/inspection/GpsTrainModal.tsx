import { ActiveGpsTrain } from '../../lib/hooks/useRealGpsTrains';
import { X, ShieldCheck, Gauge, Compass, MapPin, Radio, AlertTriangle } from 'lucide-react';

interface GpsTrainModalProps {
  train: ActiveGpsTrain | null;
  onClose: () => void;
}

export const GpsTrainModal = ({ train, onClose }: GpsTrainModalProps) => {
  if (!train) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden select-none">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-lg text-white shadow-md"
              style={{ backgroundColor: train.color }}
            >
              {train.id.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black text-blue-400">
                  #{train.id}
                </span>
                <h3 className="font-bold text-base leading-tight">
                  {train.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                {train.fromStation} ➔ {train.toStation}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Grid */}
        <div className="p-5 space-y-4">
          {/* Status Alert if Diverted */}
          {train.isDiverted && (
            <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Autonomous AI Re-route Active:</span> Track maintenance block detected on UP Main Line. Train dynamically switched to Fast Express Line without halt.
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Speed Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1">
                <Gauge className="w-4 h-4 text-blue-600" />
                GPS SPEED
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {train.currentSpeedKmH}
                </span>
                <span className="text-xs font-bold text-slate-500">km/h</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                Authorized: {train.speedKmH} km/h
              </div>
            </div>

            {/* Heading / Compass */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1">
                <Compass className="w-4 h-4 text-indigo-600" />
                BEARING
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {Math.round(train.bearing)}°
                </span>
                <span className="text-xs font-bold text-slate-500">True N</span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold mt-1">
                Track: {train.trackType} Main
              </div>
            </div>
          </div>

          {/* Coordinates & Kavach */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                Live GPS Coordinates:
              </span>
              <span className="font-mono font-bold text-slate-800">
                {train.position.lat.toFixed(4)}° N, {train.position.lng.toFixed(4)}° E
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
                <Radio className="w-3.5 h-3.5 text-emerald-500" />
                Kavach TCAS Radio:
              </span>
              <span className="font-mono font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                99.8% Connected
              </span>
            </div>
          </div>

          {/* Rake Details */}
          <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Locomotive / Shed:</span>
              <span className="font-semibold text-slate-800">{train.locoType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Rake Composition:</span>
              <span className="font-semibold text-slate-800">{train.rakeComposition}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            Close Telemetry
          </button>
        </div>
      </div>
    </div>
  );
};
