import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import {
  UP_MAIN_LINE,
  DOWN_MAIN_LINE,
  FAST_LINE,
  SUBURBAN_LINE,
} from '../../data/realTracksData';
import {
  SURVEYED_CROSSOVER_SWITCHES,
  SURVEYED_PLATFORM_LOOPS,
} from '../../data/exactSurveyedTracks';

interface RailwayPolylinesProps {
  blockActive: boolean;
}

export const RailwayPolylines = ({ blockActive }: RailwayPolylinesProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    const polylines: google.maps.Polyline[] = [];

    // Helper to render rail with stone ballast casing + steel track
    const renderTrack = (
      points: { lat: number; lng: number }[],
      railColor: string,
      weight: number,
      ballastWeight: number = 6.5
    ) => {
      // 1. Dark Ballast Bed
      const ballast = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#0f172a',
        strokeOpacity: 0.7,
        strokeWeight: ballastWeight,
        map,
      });
      polylines.push(ballast);

      // 2. High-Visibility Steel Rail
      const rail = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: railColor,
        strokeOpacity: 0.95,
        strokeWeight: weight,
        map,
      });
      polylines.push(rail);
    };

    // 1. Render UP Main Line (Towards Chennai Central - Blue)
    renderTrack(UP_MAIN_LINE, '#38bdf8', 3.5);

    // 2. Render DOWN Main Line (Towards Chengalpattu - Blue)
    renderTrack(DOWN_MAIN_LINE, '#38bdf8', 3.5);

    // 3. Render Fast Corridor Track (Vande Bharat & Superfast - Gold)
    renderTrack(FAST_LINE, '#f59e0b', 3.5);

    // 4. Render Suburban Track (Cyan)
    renderTrack(SUBURBAN_LINE, '#06b6d4', 2.5, 5);

    // 5. Render Real-World Crossover Turnouts & Merging Switches
    SURVEYED_CROSSOVER_SWITCHES.forEach((crossover) => {
      const switchLine = new google.maps.Polyline({
        path: crossover.points,
        geodesic: true,
        strokeColor: '#facc15', // Gold switch turnout
        strokeOpacity: 0.9,
        strokeWeight: 3.0,
        map,
      });
      polylines.push(switchLine);
    });

    // 6. Render Platform Loop Lines at Stations
    SURVEYED_PLATFORM_LOOPS.forEach((loop) => {
      const loopLine = new google.maps.Polyline({
        path: loop.points,
        geodesic: true,
        strokeColor: '#94a3b8', // Silver loop lines
        strokeOpacity: 0.8,
        strokeWeight: 2.5,
        map,
      });
      polylines.push(loopLine);
    });

    // 7. Active Maintenance Block Segment (between Tambaram and Chromepet on UP Line)
    let blockPolylines: google.maps.Polyline[] = [];
    if (blockActive) {
      const blockedPoints = UP_MAIN_LINE.filter(
        (p) => p.lat >= 12.9230 && p.lat <= 12.9530
      );

      if (blockedPoints.length > 1) {
        const hazardGlow = new google.maps.Polyline({
          path: blockedPoints,
          geodesic: true,
          strokeColor: '#ef4444',
          strokeOpacity: 0.6,
          strokeWeight: 16,
          map,
        });
        const hazardLine = new google.maps.Polyline({
          path: blockedPoints,
          geodesic: true,
          strokeColor: '#dc2626',
          strokeOpacity: 1.0,
          strokeWeight: 6,
          map,
        });
        blockPolylines.push(hazardGlow, hazardLine);
      }
    }

    return () => {
      polylines.forEach((p) => p.setMap(null));
      blockPolylines.forEach((p) => p.setMap(null));
    };
  }, [map, blockActive]);

  return null;
};
