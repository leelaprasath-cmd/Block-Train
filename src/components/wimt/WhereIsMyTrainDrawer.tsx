import { useState } from 'react';
import { WIMT_TRAIN_SCHEDULES } from '../../data/wimtTrainSchedules';
import {
  Train as TrainIcon,
  X,
  Gauge,
  Radio,
  Clock,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react';

interface WhereIsMyTrainDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrainNumber: string;
  onSelectTrainNumber: (num: string) => void;
  liveSpeedKmH?: number;
  currentStationCode?: string;
}

export const WhereIsMyTrainDrawer = ({
  isOpen,
  onClose,
  selectedTrainNumber,
  onSelectTrainNumber,
  liveSpeedKmH = 112,
  currentStationCode = 'TBM'
}: WhereIsMyTrainDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const trainData =
    WIMT_TRAIN_SCHEDULES[selectedTrainNumber] ||
    WIMT_TRAIN_SCHEDULES['20643'];

  if (!isOpen) return null;

  // Filter available trains
  const availableTrains = Object.values(WIMT_TRAIN_SCHEDULES).filter(
    (t) =>
      t.trainNumber.includes(searchQuery) ||
      t.trainName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Find index of current station in schedule
  const currentStationIndex = trainData.schedule.findIndex(
    (s) => s.stationCode === currentStationCode
  );
  const activeIndex = currentStationIndex !== -1 ? currentStationIndex : 6; // Default near Tambaram

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-slate-200 flex flex-col select-none animate-slideUp font-sans">
      {/* Top App Header (Styled like Where Is My Train) */}
      <div className="bg-[#1e3a8a] text-white p-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-blue-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <TrainIcon className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                WHERE IS MY TRAIN
                <span className="text-[10px] font-mono font-bold bg-amber-400 text-slate-900 px-1.5 py-0.5 rounded">
                  NTES LIVE
                </span>
              </h2>
              <p className="text-[11px] text-blue-200 font-mono">
                Indian Railways Live Tracker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Train Selector / Search Bar */}
        <div className="mt-3">
          <div className="relative">
            <Search className="w-4 h-4 text-blue-300 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search train (e.g. 20643, Vande Bharat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-blue-950/60 text-white placeholder-blue-300 text-xs pl-9 pr-3 py-2 rounded-xl border border-blue-700/50 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {searchQuery && (
            <div className="mt-2 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-40 overflow-y-auto">
              {availableTrains.map((t) => (
                <button
                  key={t.trainNumber}
                  onClick={() => {
                    onSelectTrainNumber(t.trainNumber);
                    setSearchQuery('');
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between text-xs border-b border-slate-100"
                >
                  <span className="font-bold text-blue-950">
                    {t.trainNumber} - {t.trainName}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Current Selected Train Headline */}
        <div className="mt-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between">
            <span className="font-mono text-base font-black text-amber-300">
              #{trainData.trainNumber}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              ON TIME
            </span>
          </div>
          <div className="font-bold text-sm text-white mt-0.5 leading-snug">
            {trainData.trainName}
          </div>
          <div className="text-xs text-blue-200 mt-1 flex items-center justify-between font-mono">
            <span>{trainData.origin} ({trainData.originCode})</span>
            <span>➔</span>
            <span>{trainData.destination} ({trainData.destinationCode})</span>
          </div>
        </div>
      </div>

      {/* Live Telemetry Bar */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 font-mono">
        <div className="flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-blue-600" />
          <span className="font-extrabold text-slate-900">{liveSpeedKmH} km/h</span>
          <span className="text-[10px] text-slate-400">SPEED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="text-slate-600">GPS Updated: Live</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Kavach Active
        </div>
      </div>

      {/* Station Timeline (Authentic Where Is My Train Format) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-0 relative">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
          <span>Route & Schedule</span>
          <span className="font-mono text-[11px] text-blue-600 font-semibold">
            {trainData.schedule.length} Stations
          </span>
        </div>

        {trainData.schedule.map((item, idx) => {
          const isPassed = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={item.stationCode} className="relative flex items-start group">
              {/* Left Timeline Vertical Track Line */}
              <div className="w-8 flex flex-col items-center shrink-0">
                {/* Connecting Line */}
                {idx > 0 && (
                  <div
                    className={`w-0.5 h-6 -mt-2 ${
                      isPassed ? 'bg-slate-300' : isCurrent ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Timeline Dot or Train Icon */}
                {isCurrent ? (
                  <div className="relative z-10 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-100 animate-bounce">
                    <TrainIcon className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div
                    className={`relative z-10 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      isPassed
                        ? 'bg-slate-300 border-slate-400'
                        : 'bg-white border-blue-600'
                    }`}
                  />
                )}

                {/* Trailing Line */}
                {idx < trainData.schedule.length - 1 && (
                  <div
                    className={`w-0.5 h-6 ${
                      isPassed ? 'bg-slate-300' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>

              {/* Station Details Card */}
              <div
                className={`flex-1 ml-2 mb-3 p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-sm ring-1 ring-emerald-200'
                    : isPassed
                    ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                    : 'bg-white border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-xs font-black px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.stationCode}
                    </span>
                    <span className="font-bold text-xs text-slate-900">
                      {item.stationName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {item.platform}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Arr: <strong className="text-slate-800">{item.scheduledArrival}</strong>
                    </span>
                    <span>
                      Dep: <strong className="text-slate-800">{item.scheduledDeparture}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {item.distanceKm} km
                  </span>
                </div>

                {isCurrent && (
                  <div className="mt-2 pt-1.5 border-t border-emerald-200 flex items-center justify-between text-[10px] font-bold text-emerald-800">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      TRAIN IS CURRENTLY HERE
                    </span>
                    <span>Dwell: {item.haltMinutes > 0 ? `${item.haltMinutes}m` : 'Pass'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Notice */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 text-center font-mono">
        Official Indian Railways NTES Timetable & Live Corridor Feed
      </div>
    </div>
  );
};
