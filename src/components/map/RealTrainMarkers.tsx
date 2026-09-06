import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { ActiveGpsTrain } from '../../lib/hooks/useRealGpsTrains';
import { Navigation } from 'lucide-react';

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
            title={`${train.name} (${train.id}) - Speed: ${train.currentSpeedKmH} km/h - Click to view train details`}
          >
            {/* The outer container is centered exactly at (0, 0) over the rail */}
            <div
              className="relative group cursor-pointer select-none flex items-center justify-center"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              {/* Radar Pulsing Wave Ring */}
              <div
                className="absolute -inset-2.5 rounded-full opacity-60 animate-ping pointer-events-none"
                style={{ backgroundColor: train.color }}
              />

              {/* High-Precision Train Dot / Puck sitting directly on top of the rail */}
              <div
                className={`relative w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-2xl transition-all duration-200 ${
                  isSelected ? 'scale-125 ring-4 ring-white' : 'hover:scale-115'
                }`}
                style={{ backgroundColor: train.color }}
              >
                {/* Directional Heading Indicator rotated by train.bearing */}
                <Navigation
                  className="w-3.5 h-3.5 text-white drop-shadow"
                  style={{
                    transform: `rotate(${train.bearing}deg)`,
                    transition: 'transform 0.2s ease-out'
                  }}
                />
              </div>

              {/* Floating Train Tag Anchored Directly Above the Puck (Does NOT pull train sideways!) */}
              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap z-30">
                <div
                  className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono font-black shadow-xl backdrop-blur-md flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-slate-950 text-white border-blue-400 ring-2 ring-blue-400'
                      : 'bg-white/95 text-slate-900 border-slate-300 group-hover:border-blue-500'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: train.color }}
                  />
                  <span>#{train.id}</span>
                  <span className="text-slate-500 font-normal">
                    {train.currentSpeedKmH} km/h
                  </span>
                  {train.isDiverted && (
                    <span className="px-1 py-0.2 rounded text-[8px] bg-amber-500/20 text-amber-600 font-bold border border-amber-400/40">
                      DIVERTED
                    </span>
                  )}
                </div>
              </div>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};

