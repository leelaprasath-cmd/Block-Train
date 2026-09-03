import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { REAL_STATIONS, GeoStation } from '../../data/realTracksData';

interface RealStationMarkersProps {
  onSelectStation: (station: GeoStation) => void;
  selectedStationId?: string;
}

export const RealStationMarkers = ({ onSelectStation, selectedStationId }: RealStationMarkersProps) => {
  const map = useMap();

  const handleStationClick = (st: GeoStation) => {
    onSelectStation(st);
    if (map) {
      map.panTo({ lat: st.lat, lng: st.lng });
      map.setZoom(15);
    }
  };

  return (
    <>
      {REAL_STATIONS.map((st) => {
        const isSelected = selectedStationId === st.id;
        const isMajor = st.type === 'terminal' || st.type === 'junction';

        return (
          <AdvancedMarker
            key={st.id}
            position={{ lat: st.lat, lng: st.lng }}
            onClick={() => handleStationClick(st)}
            title={`${st.name} (${st.code}) - ${st.platforms} Platforms`}
          >
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-xl backdrop-blur-md cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-400 scale-110 shadow-blue-500/50'
                  : isMajor
                  ? 'bg-white/95 text-slate-900 border-blue-500 hover:scale-105'
                  : 'bg-white/90 text-slate-800 border-slate-300 hover:scale-105'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isMajor ? 'bg-amber-500' : 'bg-blue-500'
                }`}
              />
              <span className="font-mono text-xs font-black tracking-wider">
                {st.code}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 border-l border-slate-200 pl-1.5 hidden md:inline">
                {st.platforms} PF
              </span>
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
};
