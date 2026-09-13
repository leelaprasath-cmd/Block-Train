import { useState, useEffect } from 'react';
import {
  REAL_GPS_TRAIN_PRESETS,
  RealGpsTrain,
  UP_SLOW_LINE,
  DN_SLOW_LINE,
  UP_FAST_LINE,
  DN_FAST_LINE,
  REAL_STATIONS,
  GeoStation
} from '../../data/realTracksData';
import { WIMT_TRAIN_SCHEDULES } from '../../data/wimtTrainSchedules';
import { interpolatePolyline, LatLng } from '../utils/geoGeometry';

export interface TimetableActiveTrain extends RealGpsTrain {
  progressRatio: number;
  position: LatLng;
  bearing: number;
  currentSpeedKmH: number;
  targetSpeedKmH: number;
  isBraking: boolean;
  isDiverted: boolean;
  status: 'RUNNING_ON_TIME' | 'DWELLING_AT_STATION' | 'DIVERSIFIED_LOOP' | 'DECELERATING_KAVACH';
  currentTrackName: string;
  currentStationCode: string;
  nextStationCode: string;
  nextStationName: string;
  scheduledEta: string;
  dwellCountdownSec: number;
  assignedPlatform: string;
  delayMinutes: number;
}

export const useTimetableTrains = (speedMultiplier: number, blockActive: boolean) => {
  const [trains, setTrains] = useState<TimetableActiveTrain[]>(() => {
    // Initial distribution along the 4 lines according to timetable stations
    const initialOffsets: Record<string, number> = {
      '20643': 0.32, // Vande Bharat between Chengalpattu and Tambaram
      '12638': 0.18, // Pandian Express near Guduvancheri
      '40012': 0.52, // Tambaram - Beach EMU approaching Pallavaram
      '40015': 0.76, // Beach - Chengalpattu EMU approaching Guindy
      '22671': 0.88, // Tejas Express departing Chennai Egmore
      '66042': 0.45, // Freight near Vandalur siding
    };

    return REAL_GPS_TRAIN_PRESETS.map((t) => {
      // Map to 4 Real-World Tracks
      let line = UP_FAST_LINE;
      let trackName = 'Track 3: UP FAST (Express)';

      if (t.trackType === 'UP_SLOW') {
        line = UP_SLOW_LINE;
        trackName = 'Track 1: UP SLOW (Suburban)';
      } else if (t.trackType === 'DN_SLOW') {
        line = DN_SLOW_LINE;
        trackName = 'Track 2: DN SLOW (Suburban)';
      } else if (t.trackType === 'UP_FAST') {
        line = UP_FAST_LINE;
        trackName = 'Track 3: UP FAST (Express)';
      } else if (t.trackType === 'DN_FAST') {
        line = DN_FAST_LINE;
        trackName = 'Track 4: DN FAST (Express/Freight)';
      }

      const initialRatio = initialOffsets[t.id] ?? 0.25;
      const { position, bearing } = interpolatePolyline(line, initialRatio);

      const scheduleData = WIMT_TRAIN_SCHEDULES[t.id];
      const nextStop = scheduleData?.schedule[1] || {
        stationCode: 'TBM',
        stationName: 'Tambaram',
        scheduledArrival: '11:18',
        platform: 'PF 2'
      };

      return {
        ...t,
        progressRatio: initialRatio,
        position,
        bearing: t.direction === -1 ? (bearing + 180) % 360 : bearing,
        currentSpeedKmH: t.speedKmH,
        targetSpeedKmH: t.speedKmH,
        isBraking: false,
        isDiverted: false,
        status: 'RUNNING_ON_TIME',
        currentTrackName: trackName,
        currentStationCode: 'CGL',
        nextStationCode: nextStop.stationCode,
        nextStationName: nextStop.stationName,
        scheduledEta: nextStop.scheduledArrival,
        dwellCountdownSec: 0,
        assignedPlatform: nextStop.platform,
        delayMinutes: 0,
      };
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((prev) =>
        prev.map((train) => {
          // 1. Identify track line
          let activePath = UP_FAST_LINE;
          let trackName = 'Track 3: UP FAST (Express)';

          if (train.trackType === 'UP_SLOW') {
            activePath = UP_SLOW_LINE;
            trackName = 'Track 1: UP SLOW (Suburban)';
          } else if (train.trackType === 'DN_SLOW') {
            activePath = DN_SLOW_LINE;
            trackName = 'Track 2: DN SLOW (Suburban)';
          } else if (train.trackType === 'UP_FAST') {
            activePath = UP_FAST_LINE;
            trackName = 'Track 3: UP FAST (Express)';
          } else if (train.trackType === 'DN_FAST') {
            activePath = DN_FAST_LINE;
            trackName = 'Track 4: DN FAST (Express/Freight)';
          }

          let isDiverted = false;
          let targetSpeed = train.speedKmH;

          // 2. Real-World AI Rerouting when maintenance block is injected on UP FAST Line near Tambaram/Chromepet
          if (
            blockActive &&
            train.trackType === 'UP_FAST' &&
            train.progressRatio > 0.42 &&
            train.progressRatio < 0.62
          ) {
            // Divert through TBM crossover onto UP SLOW / Platform Loop
            activePath = UP_SLOW_LINE;
            trackName = 'Track 1: UP SLOW (AI Diverted via TBM Loop)';
            isDiverted = true;
            targetSpeed = 45; // Turnout caution speed limit
          }

          // 3. Station Proximity Detection for Timetable Dwell
          let newDwell = train.dwellCountdownSec;
          let status: TimetableActiveTrain['status'] = isDiverted ? 'DIVERSIFIED_LOOP' : 'RUNNING_ON_TIME';

          // Find closest station along line
          let closestStation: GeoStation = REAL_STATIONS[0];
          let minDist = 9999;
          for (const st of REAL_STATIONS) {
            const dLat = st.lat - train.position.lat;
            const dLng = st.lng - train.position.lng;
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);
            if (dist < minDist) {
              minDist = dist;
              closestStation = st;
            }
          }

          // Suburban trains stop at every station; Express/Vande Bharat stop only at major hubs (TBM, CGL, MS, MAS)
          const isStopScheduled =
            train.type === 'suburban' ||
            ['TBM', 'CGL', 'MS', 'MAS'].includes(closestStation.code);

          // If within station perimeter (< 0.0035 degrees ~ 380m)
          const isAtStation = minDist < 0.0035 && isStopScheduled;

          if (isAtStation && newDwell <= 0 && Math.random() < 0.03) {
            // Trigger 12-second simulated station dwell
            newDwell = 12;
          }

          let currentSpeed = train.currentSpeedKmH;

          if (newDwell > 0) {
            // Train is dwelling at platform
            newDwell = Math.max(0, newDwell - 0.1 * speedMultiplier);
            targetSpeed = 0;
            currentSpeed = Math.max(0, currentSpeed - 12 * speedMultiplier);
            status = 'DWELLING_AT_STATION';
          } else {
            // Train is moving, smoothly accelerate towards target speed
            if (currentSpeed < targetSpeed) {
              currentSpeed = Math.min(targetSpeed, currentSpeed + 4 * speedMultiplier);
            } else if (currentSpeed > targetSpeed) {
              currentSpeed = Math.max(targetSpeed, currentSpeed - 6 * speedMultiplier);
            }
          }

          // 4. Advance progress along path
          const baseStep = 0.00028 * (currentSpeed / 100) * speedMultiplier;
          let newProgress = train.progressRatio + (train.direction === 1 ? baseStep : -baseStep);

          if (newProgress > 1) newProgress = 0;
          if (newProgress < 0) newProgress = 1;

          const { position, bearing } = interpolatePolyline(activePath, newProgress);

          return {
            ...train,
            progressRatio: newProgress,
            position,
            bearing: train.direction === -1 ? (bearing + 180) % 360 : bearing,
            currentSpeedKmH: Math.round(currentSpeed),
            targetSpeedKmH: targetSpeed,
            isBraking: currentSpeed < train.speedKmH,
            isDiverted,
            status,
            currentTrackName: trackName,
            currentStationCode: closestStation.code,
            nextStationName: closestStation.name,
            dwellCountdownSec: Math.round(newDwell),
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [speedMultiplier, blockActive]);

  return trains;
};
