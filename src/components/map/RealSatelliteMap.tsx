import { useState } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { RailwayPolylines } from './RailwayPolylines';
import { RealStationMarkers } from './RealStationMarkers';
import { RealTrainMarkers } from './RealTrainMarkers';
import { useRealGpsTrains } from '../../lib/hooks/useRealGpsTrains';
import { REAL_STATIONS, GeoStation } from '../../data/realTracksData';
import { Layers } from 'lucide-react';

interface RealSatelliteMapProps {
  speedMultiplier: number;
  blockActive: boolean;
  onSelectTrainWimt?: (trainId: string, speedKmH: number) => void;
}

// Inner Station Navigator with access to map instance
const MapControls = ({
  mapType,
  setMapType
}: {
  mapType: string;
  setMapType: (t: string) => void;
}) => {
  const map = useMap();
  const [activeStationId, setActiveStationId] = useState<string>('TBM');

  const jumpToStation = (st: GeoStation) => {
    setActiveStationId(st.id);
    if (map) {
      map.panTo({ lat: st.lat, lng: st.lng });
      map.setZoom(15);
    }
  };

  const resetCorridorView = () => {
    if (map) {
      map.panTo({ lat: 12.95, lng: 80.14 });
      map.setZoom(12);
    }
  };

  return (
    <>
      {/* Top Right Floating Map Viewport Switcher */}
      <div className="absolute top-20 right-6 z-30 select-none pointer-events-auto font-mono">
        <div className="flex items-center gap-1 occ-dock-glass p-1 rounded-xl shadow-xl text-xs">
          <div className="flex items-center gap-1 px-2.5 text-slate-400 text-[11px] font-bold">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>GIS LAYER:</span>
          </div>
          {[
            { id: 'hybrid', label: 'Hybrid' },
            { id: 'satellite', label: 'Satellite' },
            { id: 'roadmap', label: 'Roadmap' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMapType(item.id)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                mapType === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Floating Station Quick Navigator Dock */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 max-w-[96vw] pointer-events-auto select-none font-mono">
        <div className="flex items-center gap-2 occ-dock-glass p-1.5 rounded-2xl shadow-2xl overflow-x-auto max-w-full no-scrollbar">
          <div className="flex items-center gap-1.5 px-3 border-r border-slate-700/80 shrink-0 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              MAS STATIONS
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {REAL_STATIONS.map((st) => {
              const isMajor = ['MAS', 'MS', 'MBM', 'TBM', 'CGL'].includes(st.code);
              const isActive = activeStationId === st.id;

              return (
                <button
                  key={st.id}
                  onClick={() => jumpToStation(st)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-blue-400'
                      : isMajor
                      ? 'bg-slate-800/80 text-amber-300 hover:bg-slate-700/80 hover:text-white border border-amber-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={`${st.name} (${st.platforms} Platforms)`}
                >
                  <span>{st.code}</span>
                  {isMajor && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-white/15 text-slate-200">
                      {st.platforms}P
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-l border-slate-700/80 pl-2 shrink-0 flex items-center gap-1.5">
            <button
              onClick={resetCorridorView}
              className="px-3 py-1 text-[11px] font-bold text-cyan-300 hover:text-white bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-lg transition-all uppercase tracking-wider"
              title="Reset to Full Chennai Suburban Corridor View"
            >
              Overview
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export const RealSatelliteMap = ({
  speedMultiplier,
  blockActive,
  onSelectTrainWimt
}: RealSatelliteMapProps) => {
  const apiKey =
    ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) ||
    'AIzaSyB0bvqkB-Q46jHPxMs7YyJ-SM94MfYJ4tY';

  const [mapType, setMapType] = useState<string>('hybrid');
  const [_selectedStation, setSelectedStation] = useState<GeoStation | null>(null);

  const trains = useRealGpsTrains(speedMultiplier, blockActive);

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900">
      <APIProvider apiKey={apiKey}>
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={{ lat: 12.95, lng: 80.14 }}
          defaultZoom={12}
          mapId="DEMO_MAP_ID"
          mapTypeId={mapType}
          internalUsageAttributionIds={['gmp_git_agentskills_v1']}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {/* Real Railway Tracks */}
          <RailwayPolylines blockActive={blockActive} />

          {/* Real Station Pins */}
          <RealStationMarkers
            onSelectStation={(st) => setSelectedStation(st)}
            selectedStationId={_selectedStation?.id}
          />

          {/* Vibrant Colored Dot Train Markers on Satellite View */}
          <RealTrainMarkers
            trains={trains}
            onSelectTrain={(train) => {
              if (onSelectTrainWimt) {
                onSelectTrainWimt(train.id, train.currentSpeedKmH);
              }
            }}
          />

          {/* Floating UI Controls */}
          <MapControls
            mapType={mapType}
            setMapType={setMapType}
          />
        </Map>
      </APIProvider>
    </div>
  );
};
