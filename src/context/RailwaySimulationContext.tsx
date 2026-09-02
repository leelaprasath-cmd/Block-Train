import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  ActiveView,
  StationNode,
  TrackSegment,
  TrainTelemetry,
  RailwaySignal,
  MaintenanceBlock,
  WorkerCrew,
  RadioMessage,
  AIDecisionLog,
} from '../types/railway';
import { CORRIDOR_STATIONS, CORRIDOR_TRACKS, CORRIDOR_SIGNALS } from '../data/stationsData';
import { INITIAL_TRAINS } from '../data/trainsData';
import {
  INITIAL_MAINTENANCE_BLOCKS,
  INITIAL_WORKER_CREWS,
  INITIAL_RADIO_MESSAGES,
} from '../data/maintenancePresets';

interface SimulationContextType {
  isRunning: boolean;
  speedMultiplier: number;
  simulatedTime: string;
  activeView: ActiveView;
  stations: StationNode[];
  tracks: TrackSegment[];
  trains: TrainTelemetry[];
  signals: RailwaySignal[];
  maintenanceBlocks: MaintenanceBlock[];
  workerCrews: WorkerCrew[];
  radioMessages: RadioMessage[];
  aiDecisionLogs: AIDecisionLog[];
  selectedTrain: TrainTelemetry | null;
  selectedTrack: TrackSegment | null;
  selectedStation: StationNode | null;
  selectedCrew: WorkerCrew | null;
  audioChatterEnabled: boolean;
  activeEmergencyBrake: boolean;

  // Actions
  toggleSimulation: () => void;
  setSpeedMultiplier: (speed: number) => void;
  setActiveView: (view: ActiveView) => void;
  selectTrain: (train: TrainTelemetry | null) => void;
  selectTrack: (track: TrackSegment | null) => void;
  selectStation: (station: StationNode | null) => void;
  selectCrew: (crew: WorkerCrew | null) => void;
  toggleAudioChatter: () => void;
  toggleTrackBlock: (trackId: string) => void;
  approveBlock: (blockId: string) => void;
  createMaintenanceBlock: (block: Omit<MaintenanceBlock, 'id' | 'permitNumber' | 'status' | 'aiConfidenceScore'>) => void;
  triggerEmergencyBrake: (trainId?: string) => void;
  resetEmergencyBrake: () => void;
  broadcastRadioMessage: (text: string, channel: RadioMessage['channel'], sender?: string) => void;
}

const RailwaySimulationContext = createContext<SimulationContextType | null>(null);

export const RailwaySimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [activeView, setActiveView] = useState<ActiveView>('MAP');
  const [audioChatterEnabled, setAudioChatterEnabled] = useState<boolean>(true);
  const [activeEmergencyBrake, setActiveEmergencyBrake] = useState<boolean>(false);

  // Time management
  const [simClock, setSimClock] = useState<Date>(new Date(2026, 8, 2, 15, 4, 30));

  // Domain data state
  const [stations] = useState<StationNode[]>(CORRIDOR_STATIONS);
  const [tracks, setTracks] = useState<TrackSegment[]>(CORRIDOR_TRACKS);
  const [trains, setTrains] = useState<TrainTelemetry[]>(INITIAL_TRAINS);
  const [signals, setSignals] = useState<RailwaySignal[]>(CORRIDOR_SIGNALS);
  const [maintenanceBlocks, setMaintenanceBlocks] = useState<MaintenanceBlock[]>(INITIAL_MAINTENANCE_BLOCKS);
  const [workerCrews, setWorkerCrews] = useState<WorkerCrew[]>(INITIAL_WORKER_CREWS);
  const [radioMessages, setRadioMessages] = useState<RadioMessage[]>(INITIAL_RADIO_MESSAGES);
  const [aiDecisionLogs, setAiDecisionLogs] = useState<AIDecisionLog[]>([
    {
      id: 'AI-LOG-101',
      timestamp: '15:01:10',
      type: 'RE_ROUTE',
      triggerEvent: 'OHE Maintenance Block 089 active on Down Main (TBM-CMP)',
      decisionText: 'Dynamically re-routed Pandian Superfast 12638 via Fast Express Corridor. Speed maintained at 88 km/h.',
      trainIdAffected: 'TRN-12638',
      cascadingDelaySavedMin: 14.5,
      fuelSavedLiters: 110,
      confidence: 96.8,
    },
    {
      id: 'AI-LOG-102',
      timestamp: '14:58:30',
      type: 'SPEED_MODULATION',
      triggerEvent: 'Track worker Gang 08 active at KM 19.8',
      decisionText: 'Enforced 30 km/h advisory caution for approaching CONCOR freight. Kavach speed ceiling updated.',
      trainIdAffected: 'TRN-66042',
      cascadingDelaySavedMin: 6.2,
      fuelSavedLiters: 45,
      confidence: 99.1,
    },
  ]);

  // Selected state
  const [selectedTrain, setSelectedTrain] = useState<TrainTelemetry | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackSegment | null>(null);
  const [selectedStation, setSelectedStation] = useState<StationNode | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<WorkerCrew | null>(null);

  // Keep updated ref for fast loop
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;
  const blocksRef = useRef(maintenanceBlocks);
  blocksRef.current = maintenanceBlocks;

  // Clock formatter
  const simulatedTimeString = simClock.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Toggle track block status (User interaction on Digital Twin Canvas)
  const toggleTrackBlock = useCallback((trackId: string) => {
    setTracks(prevTracks =>
      prevTracks.map(trk => {
        if (trk.id === trackId) {
          const isNowBlocked = trk.status !== 'MAINTENANCE_BLOCKED';
          const newStatus = isNowBlocked ? 'MAINTENANCE_BLOCKED' : 'CLEAR';
          const newSpeed = isNowBlocked ? 0 : trk.speedLimitKmh;

          if (isNowBlocked) {
            // Log AI Decision
            const newDecision: AIDecisionLog = {
              id: `AI-LOG-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
              type: 'BLOCK_OPTIMIZATION',
              triggerEvent: `Manual Block Injected on ${trk.id}`,
              decisionText: `Track ${trk.id} closed for safety. AI immediately shifting upcoming train paths to alternate corridor loop.`,
              trainIdAffected: 'All Approaching',
              cascadingDelaySavedMin: 8.5,
              fuelSavedLiters: 65,
              confidence: 97.5,
            };
            setAiDecisionLogs(prev => [newDecision, ...prev.slice(0, 19)]);
          }

          return {
            ...trk,
            status: newStatus,
            currentSpeedLimitKmh: newSpeed,
          };
        }
        return trk;
      })
    );
  }, []);

  // Approve a pending maintenance block
  const approveBlock = useCallback((blockId: string) => {
    setMaintenanceBlocks(prev =>
      prev.map(blk => {
        if (blk.id === blockId) {
          return {
            ...blk,
            status: 'ACTIVE',
            approvedByController: 'R. Seshadri (Chief Controller, MAS)',
          };
        }
        return blk;
      })
    );

    // Also update track status
    setTracks(prev =>
      prev.map(trk => {
        const targetBlock = maintenanceBlocks.find(b => b.id === blockId);
        if (targetBlock && trk.id === targetBlock.sectionTrackId) {
          return {
            ...trk,
            status: 'MAINTENANCE_BLOCKED',
            currentSpeedLimitKmh: targetBlock.speedRestrictionKmh,
            activeBlockId: blockId,
          };
        }
        return trk;
      })
    );

    // Broadcast automated radio dispatch
    const targetBlock = maintenanceBlocks.find(b => b.id === blockId);
    if (targetBlock) {
      const radioNote: RadioMessage = {
        id: `RAD-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        sender: 'Chief Controller MAS',
        channel: 'CHANNEL_1_URGENT',
        audioDurationSec: 4,
        transcription: `Permit ${targetBlock.permitNumber} APPROVED for ${targetBlock.lineName}. All trains observe alternate signaling.`,
        isUrgent: true,
      };
      setRadioMessages(prev => [radioNote, ...prev]);
    }
  }, [maintenanceBlocks]);

  // Create a new maintenance block
  const createMaintenanceBlock = useCallback(
    (blockData: Omit<MaintenanceBlock, 'id' | 'permitNumber' | 'status' | 'aiConfidenceScore'>) => {
      const newBlock: MaintenanceBlock = {
        ...blockData,
        id: `BLK-2026-${Math.floor(100 + Math.random() * 900)}`,
        permitNumber: `SR-MAS-2026-${Math.floor(100 + Math.random() * 900)}-AUTO`,
        status: 'APPROVED',
        aiConfidenceScore: +(92 + Math.random() * 7).toFixed(1),
        approvedByController: 'R. Seshadri (Chief Controller, MAS)',
      };

      setMaintenanceBlocks(prev => [newBlock, ...prev]);

      // Apply to track
      setTracks(prev =>
        prev.map(trk => {
          if (trk.id === blockData.sectionTrackId) {
            return {
              ...trk,
              status: 'MAINTENANCE_BLOCKED',
              currentSpeedLimitKmh: blockData.speedRestrictionKmh,
              activeBlockId: newBlock.id,
            };
          }
          return trk;
        })
      );
    },
    []
  );

  // Emergency SOS Brake
  const triggerEmergencyBrake = useCallback((trainId?: string) => {
    setActiveEmergencyBrake(true);
    setTrains(prevTrains =>
      prevTrains.map(trn => {
        if (!trainId || trn.id === trainId) {
          return {
            ...trn,
            currentSpeedKmh: 0,
            brakePressureKgCm2: 0.0,
            tractionPowerKw: 0,
            kavachStatus: 'ARMED_ACTIVE',
          };
        }
        return trn;
      })
    );

    const sosRadio: RadioMessage = {
      id: `RAD-SOS-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      sender: 'KAVACH AUTONOMOUS SAFETY SYSTEM',
      channel: 'CHANNEL_1_URGENT',
      audioDurationSec: 5,
      transcription: `EMERGENCY BRAKE TRIPPED! Direct track protection activated. Speed zero enforced.`,
      isUrgent: true,
    };
    setRadioMessages(prev => [sosRadio, ...prev]);
  }, []);

  const resetEmergencyBrake = useCallback(() => {
    setActiveEmergencyBrake(false);
    setTrains(prev =>
      prev.map(t => ({
        ...t,
        currentSpeedKmh: Math.floor(t.maxSpeedKmh * 0.8),
        brakePressureKgCm2: 5.0,
        tractionPowerKw: 3500,
      }))
    );
  }, []);

  // Broadcast radio dispatch
  const broadcastRadioMessage = useCallback(
    (text: string, channel: RadioMessage['channel'], sender = 'Section Controller') => {
      const newMsg: RadioMessage = {
        id: `RAD-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        sender,
        channel,
        audioDurationSec: Math.max(3, Math.ceil(text.length / 25)),
        transcription: text,
        isUrgent: channel === 'CHANNEL_1_URGENT',
      };
      setRadioMessages(prev => [newMsg, ...prev]);
    },
    []
  );

  // Simulation Game Loop
  useEffect(() => {
    if (!isRunning) return;

    const intervalTimeMs = 100; // 10 ticks per second
    const simInterval = setInterval(() => {
      // Advance clock
      setSimClock(prev => new Date(prev.getTime() + intervalTimeMs * speedMultiplier));

      // Advance train positions
      setTrains(prevTrains =>
        prevTrains.map(train => {
          if (activeEmergencyBrake) return train;

          // Delta advancement
          const speedFactor = (train.currentSpeedKmh / 3600) * (speedMultiplier * 0.035);
          let newProgress = train.progressRatio + speedFactor;

          // Check track occupancy and current track status
          const currentTrack = tracksRef.current.find(t => t.id === train.currentTrackId);
          let newSpeed = train.currentSpeedKmh;

          if (currentTrack?.status === 'MAINTENANCE_BLOCKED') {
            // AI RE-ROUTING LOGIC
            // Divert train to clear adjacent line
            let alternateTrack = tracksRef.current.find(
              t =>
                t.fromStationId === currentTrack.fromStationId &&
                t.toStationId === currentTrack.toStationId &&
                t.status === 'CLEAR'
            );

            if (alternateTrack) {
              return {
                ...train,
                currentTrackId: alternateTrack.id,
                routeHistory: [...train.routeHistory, `Diverted to ${alternateTrack.id}`],
                delayMinutes: train.delayMinutes + 1,
              };
            } else {
              // Forced slow down
              newSpeed = Math.min(newSpeed, 25);
            }
          }

          // Cycle progress seamlessly between corridor endpoints
          if (newProgress >= 1.0) {
            newProgress = 0.02;
          }

          return {
            ...train,
            progressRatio: newProgress,
            currentSpeedKmh: newSpeed,
          };
        })
      );

      // Check proximity of worker crews to oncoming trains
      setWorkerCrews(prevCrews =>
        prevCrews.map(crew => {
          // Find closest train on the same or adjacent track
          let closestDistance = 3000;
          prevCrews.forEach(() => {
            // calculate against live trains
          });

          // Proximity calculation based on canvas distance
          trains.forEach(trn => {
            // Approx canvas distance
            const approxTrainX = trn.direction === 'UP' ? 100 + trn.progressRatio * 1300 : 1400 - trn.progressRatio * 1300;
            const dist = Math.abs(approxTrainX - crew.canvasX) * 4; // 1 px = 4 meters
            if (dist < closestDistance) {
              closestDistance = Math.round(dist);
            }
          });

          let warningStatus: WorkerCrew['warningStatus'] = 'NORMAL';
          if (closestDistance < 600) {
            warningStatus = 'CRITICAL_ALERT';
          } else if (closestDistance < 1200) {
            warningStatus = 'CAUTION';
          }

          return {
            ...crew,
            nearestTrainDistanceMeters: closestDistance,
            warningStatus,
          };
        })
      );

      // Dynamic signal aspects
      setSignals(prevSignals =>
        prevSignals.map(sig => {
          const track = tracksRef.current.find(t => t.id === sig.trackId);
          if (track?.status === 'MAINTENANCE_BLOCKED') return { ...sig, aspect: 'RED' };
          if (track?.status === 'CAUTION_RESTRICTED') return { ...sig, aspect: 'YELLOW' };
          return sig;
        })
      );
    }, intervalTimeMs);

    return () => clearInterval(simInterval);
  }, [isRunning, speedMultiplier, activeEmergencyBrake, trains]);

  return (
    <RailwaySimulationContext.Provider
      value={{
        isRunning,
        speedMultiplier,
        simulatedTime: simulatedTimeString,
        activeView,
        stations,
        tracks,
        trains,
        signals,
        maintenanceBlocks,
        workerCrews,
        radioMessages,
        aiDecisionLogs,
        selectedTrain,
        selectedTrack,
        selectedStation,
        selectedCrew,
        audioChatterEnabled,
        activeEmergencyBrake,
        toggleSimulation: () => setIsRunning(prev => !prev),
        setSpeedMultiplier,
        setActiveView,
        selectTrain: setSelectedTrain,
        selectTrack: setSelectedTrack,
        selectStation: setSelectedStation,
        selectCrew: setSelectedCrew,
        toggleAudioChatter: () => setAudioChatterEnabled(prev => !prev),
        toggleTrackBlock,
        approveBlock,
        createMaintenanceBlock,
        triggerEmergencyBrake,
        resetEmergencyBrake,
        broadcastRadioMessage,
      }}
    >
      {children}
    </RailwaySimulationContext.Provider>
  );
};

export const useRailwaySimulation = () => {
  const context = useContext(RailwaySimulationContext);
  if (!context) {
    throw new Error('useRailwaySimulation must be used within a RailwaySimulationProvider');
  }
  return context;
};
