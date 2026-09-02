export type LineType = 'UP_MAIN' | 'DOWN_MAIN' | 'FAST_LINE' | 'LOOP_PLATFORM' | 'YARD_LINE';

export type SignalAspect = 'GREEN' | 'DOUBLE_YELLOW' | 'YELLOW' | 'RED';

export type BlockStatus = 'CLEAR' | 'OCCUPIED' | 'MAINTENANCE_BLOCKED' | 'CAUTION_RESTRICTED';

export type TrainType = 'VANDE_BHARAT' | 'SUPERFAST' | 'SUBURBAN_EMU' | 'FREIGHT';

export type ActiveView = 'MAP' | 'PLANNER' | 'WORKERS' | 'DISPATCH' | 'AI_COPILOT' | 'PITCH_DECK';

export interface StationPlatform {
  id: string;
  platformNumber: number;
  lineType: LineType;
  trackYOffset: number;
  lengthMeters: number;
  isOccupied: boolean;
  passengerLoad: number;
}

export interface StationNode {
  id: string;
  code: string;
  name: string;
  kmMark: number;
  canvasX: number;
  canvasY: number;
  platforms: StationPlatform[];
  zone: 'SOUTHERN_RAILWAY';
  division: 'CHENNAI';
}

export interface TrackSegment {
  id: string;
  fromStationId: string;
  toStationId: string;
  lineType: LineType;
  trackIndex: number;
  lengthKm: number;
  speedLimitKmh: number;
  currentSpeedLimitKmh: number;
  status: BlockStatus;
  activeBlockId?: string;
  gradient: string;
  electrification: '25KV_AC';
  signalingType: 'AUTOMATIC_BLOCK_SIGNALING';
}

export interface TrainTelemetry {
  id: string;
  number: string;
  name: string;
  type: TrainType;
  priority: number; // 1 (Highest: Vande Bharat) to 4 (Freight)
  origin: string;
  destination: string;
  currentSpeedKmh: number;
  maxSpeedKmh: number;
  tractionPowerKw: number;
  brakePressureKgCm2: number;
  kavachStatus: 'ARMED_ACTIVE' | 'STANDBY' | 'DEGRADED';
  kavachSignalStrength: number; // 0-100%
  locoPilotName: string;
  passengerCount: number;
  coaches: number;
  progressRatio: number; // 0 to 1 along current section
  currentTrackId: string;
  currentStationId?: string;
  direction: 'UP' | 'DOWN'; // UP: towards Chennai Central, DOWN: towards Chengalpattu
  delayMinutes: number;
  nextStationEta: string;
  routeHistory: string[];
}

export interface MaintenanceBlock {
  id: string;
  permitNumber: string;
  sectionTrackId: string;
  fromStation: string;
  toStation: string;
  lineName: string;
  maintenanceType: 'OHE_CATENARY' | 'TRACK_TAMPING' | 'SIGNAL_UPGRADE' | 'RAIL_FRACTURE' | 'BRIDGE_INSPECTION';
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED';
  requestedByGang: string;
  supervisorName: string;
  speedRestrictionKmh: number;
  alternateRouteSuggested: string;
  delayImpactMinutes: number;
  aiConfidenceScore: number;
  approvedByController?: string;
}

export interface WorkerCrew {
  id: string;
  gangNumber: string;
  leadSupervisor: string;
  crewSize: number;
  currentLocationSection: string;
  gpsCoordinates: { lat: number; lng: number };
  canvasX: number;
  canvasY: number;
  trackId: string;
  workDescription: string;
  geofenceRadiusMeters: number;
  nearestTrainDistanceMeters: number;
  warningStatus: 'NORMAL' | 'CAUTION' | 'CRITICAL_ALERT';
  sosTriggered: boolean;
  batteryLevel: number;
}

export interface RailwaySignal {
  id: string;
  trackId: string;
  canvasX: number;
  canvasY: number;
  aspect: SignalAspect;
  kmPosition: number;
  direction: 'UP' | 'DOWN';
}

export interface AIDecisionLog {
  id: string;
  timestamp: string;
  type: 'RE_ROUTE' | 'SPEED_MODULATION' | 'LOOP_BYPASS' | 'BLOCK_OPTIMIZATION';
  triggerEvent: string;
  decisionText: string;
  trainIdAffected: string;
  cascadingDelaySavedMin: number;
  fuelSavedLiters: number;
  confidence: number;
}

export interface RadioMessage {
  id: string;
  timestamp: string;
  sender: string;
  channel: 'CHANNEL_1_URGENT' | 'CHANNEL_2_LOCO' | 'CHANNEL_3_GANG' | 'CHANNEL_4_STATION';
  audioDurationSec: number;
  transcription: string;
  isUrgent: boolean;
}
