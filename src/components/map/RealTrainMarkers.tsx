import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { ActiveGpsTrain } from '../../lib/hooks/useRealGpsTrains';
import { Navigation2, AlertCircle } from 'lucide-react';

interface RealTrainMarkersProps {
  trains: ActiveGpsTrain[];
  onSelectTrain: (train: ActiveGpsTrain) => void;
  selectedTrainId?: string;
}

export const RealTrainMarkers = ({ trains, onSelectTrain, selectedTrainId }: RealTrainMarkersProps) => {
  return (
    <>
      {trains.map((train) => {
        const isSelected = selectedTrainId === train.id;

        return (
          <AdvancedMarker
            key={train.id}
            position={train.position}
            onClick={() => onSelectTrain(train)}
            title={`${train.name} (${train.id}) - ${train.currentSpeedKmH} km/h`}
          >
            <div className="relative group cursor-pointer select-none">
              {/* Pulsing radar ring */}
              <div
                className="absolute -inset-2 rounded-full opacity-40 animate-ping"
                style={{ backgroundColor: train.color }}
              />

              {/* Main Train Badge */}
              <div
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-2xl backdrop-blur-md transition-transform duration-150 ${
                  isSelected
                    ? 'scale-110 border-white ring-2 ring-blue-400 bg-slate-900 text-white'
                    : 'bg-white/95 text-slate-900 border-slate-300 hover:scale-105'
                }`}
              >
                {/* Direction Heading Chevron */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-200"
                  style={{
                    backgroundColor: train.color,
                    color: '#ffffff',
                    transform: `rotate(${train.bearing}deg)`
                  }}
                >
                  <Navigation2 className="w-3 h-3 fill-current" />
                </div>

                {/* Train Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs font-black tracking-tight">
                      {train.id}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 truncate max-w-[90px]">
                      {train.name.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-extrabold text-blue-600">
                      {train.currentSpeedKmH} km/h
                    </span>
                    {train.isDiverted && (
                      <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                        <AlertCircle className="w-2.5 h-2.5" />
                        DIVERT
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};
