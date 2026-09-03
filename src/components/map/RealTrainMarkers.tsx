import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { ActiveGpsTrain } from '../../lib/hooks/useRealGpsTrains';

interface RealTrainMarkersProps {
  trains: ActiveGpsTrain[];
  onSelectTrain: (train: ActiveGpsTrain) => void;
  selectedTrainId?: string;
}

export const RealTrainMarkers = ({
  trains,
  onSelectTrain,
  selectedTrainId
}: RealTrainMarkersProps) => {
  return (
    <>
      {trains.map((train) => {
        const isSelected = selectedTrainId === train.id;

        return (
          <AdvancedMarker
            key={train.id}
            position={train.position}
            onClick={() => onSelectTrain(train)}
            title={`${train.name} (${train.id}) - Click to view train details`}
          >
            <div className="relative group cursor-pointer select-none flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2">
              {/* Radar Pulsing Wave Ring */}
              <div
                className="absolute -inset-2 rounded-full opacity-60 animate-ping"
                style={{ backgroundColor: train.color }}
              />

              {/* Vibrant Colored Dot */}
              <div
                className={`relative w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xl transition-all duration-200 ${
                  isSelected ? 'scale-125 ring-4 ring-white' : 'hover:scale-115'
                }`}
                style={{ backgroundColor: train.color }}
              >
                {/* Center Core Dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
              </div>

              {/* Sleek Train Number & Speed Badge */}
              <div
                className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono font-black shadow-lg backdrop-blur-md transition-all ${
                  isSelected
                    ? 'bg-slate-950 text-white border-blue-400 ring-2 ring-blue-400'
                    : 'bg-white/95 text-slate-900 border-slate-300 hover:border-blue-400'
                }`}
              >
                <span>#{train.id}</span>
                <span className="text-slate-400 font-normal ml-1">
                  {train.currentSpeedKmH} km/h
                </span>
              </div>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};
