import { useState, useEffect } from 'react';
import { REAL_GPS_TRAIN_PRESETS, RealGpsTrain, UP_MAIN_LINE, DOWN_MAIN_LINE, FAST_LINE } from '../../data/realTracksData';
import { interpolatePolyline, LatLng } from '../utils/geoGeometry';

export interface ActiveGpsTrain extends RealGpsTrain {
  progressRatio: number;
  position: LatLng;
  bearing: number;
  currentSpeedKmH: number;
  isBraking: boolean;
  isDiverted: boolean;
  status: 'RUNNING' | 'HALTED_STATION' | 'DIVERSIFIED_LOOP';
}

export const useRealGpsTrains = (speedMultiplier: number, blockActive: boolean) => {
  const [trains, setTrains] = useState<ActiveGpsTrain[]>(() => {
    // Initial distribution along the line
    const initialOffsets = [0.15, 0.42, 0.72, 0.88, 0.3];
    return REAL_GPS_TRAIN_PRESETS.map((t, idx) => {
      const line = t.trackType === 'FAST' ? FAST_LINE : t.trackType === 'UP' ? UP_MAIN_LINE : DOWN_MAIN_LINE;
      const initialRatio = initialOffsets[idx % initialOffsets.length];
      const { position, bearing } = interpolatePolyline(line, initialRatio);
      return {
        ...t,
        progressRatio: initialRatio,
        position,
        bearing: t.direction === -1 ? (bearing + 180) % 360 : bearing,
        currentSpeedKmH: t.speedKmH,
        isBraking: false,
        isDiverted: false,
        status: 'RUNNING'
      };
    });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((prev) =>
        prev.map((train) => {
          // Determine which path to use (divert if block is active on UP line near Tambaram/Chromepet)
          let activePath = train.trackType === 'FAST' ? FAST_LINE : train.trackType === 'UP' ? UP_MAIN_LINE : DOWN_MAIN_LINE;
          let isDiverted = false;

          // Block zone is roughly between progress 0.45 and 0.55 on the UP line
          if (blockActive && train.trackType === 'UP' && train.progressRatio > 0.40 && train.progressRatio < 0.60) {
            activePath = FAST_LINE; // AI dynamically diverts to Fast Line loop
            isDiverted = true;
          }

          // Advance progress based on speed
          // Full corridor is ~75 km. At 100 km/h, 1 second = ~0.00037 of track.
          const baseStep = 0.0003 * (train.speedKmH / 100) * speedMultiplier;
          let newProgress = train.progressRatio + (train.direction === 1 ? baseStep : -baseStep);

          // Loop around at ends
          if (newProgress > 1) newProgress = 0;
          if (newProgress < 0) newProgress = 1;

          const { position, bearing } = interpolatePolyline(activePath, newProgress);

          return {
            ...train,
            progressRatio: newProgress,
            position,
            bearing: train.direction === -1 ? (bearing + 180) % 360 : bearing,
            isDiverted,
            status: isDiverted ? 'DIVERSIFIED_LOOP' : 'RUNNING'
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [speedMultiplier, blockActive]);

  return trains;
};
