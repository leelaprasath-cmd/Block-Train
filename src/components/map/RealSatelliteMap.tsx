import { useState } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { RailwayPolylines } from './RailwayPolylines';
import { RealStationMarkers } from './RealStationMarkers';
import { RealTrainMarkers } from './RealTrainMarkers';
import { useRealGpsTrains } from '../../lib/hooks/useRealGpsTrains';
import { REAL_STATIONS, GeoStation } from '../../data/realTracksData';
import { Layers, Construction, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RealSatelliteMapProps {
  speedMultiplier: number;
  blockActive: boolean;
  onToggleBlock: () => void;
  onSelectTrainWimt?: (trainId: string, speedKmH: number) => void;
}

// Inner Station Navigator with access to map instance
const MapControls = ({
  blockActive,
  onToggleBlock,
  mapType,
  setMapType
}: {
  blockActive: boolean;
  onToggleBlock: () => void;
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
      {/* Top Floating Controls */}
      <div className="absolute top-20 right-6 z-40 flex flex-col items-end gap-2.5 select-none pointer-events-auto font-mono">
        {/* Map Type Switcher */}
        <div className="flex items-center gap-1 bg-white/95 p-1 rounded-xl border border-slate-200 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-1 px-2 text-slate-500 text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            VIEW
          </div>
          {[
            { id: 'hybrid', label: 'Hybrid' },
            { id: 'satellite', label: 'Satellite' },
            { id: 'roadmap', label: 'Roadmap' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMapType(item.id)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                mapType === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Maintenance Block Injector */}
        <button
          onClick={onToggleBlock}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold shadow-xl backdrop-blur-md transition-all ${
            blockActive
              ? 'bg-red-600 text-white border-red-500 ring-2 ring-red-400/50 shadow-red-500/30'
              : 'bg-white/95 text-slate-800 border-slate-200 hover:border-red-300 hover:text-red-600'
          }`}
        >
          <Construction className="w-4 h-4 text-amber-300" />
          <span>
            {blockActive
              ? 'ACTIVE BLOCK: TBM ⇄ CMP (AI DIVERSION)'
              : 'INJECT BLOCK: TBM ⇄ CMP'}
          </span>
          {blockActive ? (
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          )}
        </button>
      </div>

      {/* Bottom Floating Station Quick Navigator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 max-w-[95vw] pointer-events-auto select-none font-mono">
        <div className="flex items-center gap-1.5 bg-white/95 p-1.5 rounded-2xl border border-slate-200 shadow-2xl backdrop-blur-md overflow-x-auto max-w-full no-scrollbar">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 border-r border-slate-200 shrink-0">
            GPS STATIONS
          </div>
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {REAL_STATIONS.map((st) => (
              <button
                key={st.id}
                onClick={() => jumpToStation(st)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all shrink-0 ${
                  activeStationId === st.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={`${st.name} - ${st.platforms} Platforms`}
              >
                {st.code}
              </button>
            ))}
          </div>
          <div className="border-l border-slate-200 pl-1.5 shrink-0">
            <button
              onClick={resetCorridorView}
              className="px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors uppercase"
              title="Reset Corridor View"
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
  onToggleBlock,
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
            blockActive={blockActive}
            onToggleBlock={onToggleBlock}
            mapType={mapType}
            setMapType={setMapType}
          />
        </Map>
      </APIProvider>
    </div>
  );
};
