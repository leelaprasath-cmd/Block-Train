import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import {
  SURVEYED_MAINLINE_TRACKS,
  SURVEYED_CROSSOVER_SWITCHES,
  SURVEYED_PLATFORM_LOOPS
} from '../../data/exactSurveyedTracks';

interface RailwayPolylinesProps {
  blockActive: boolean;
}

export const RailwayPolylines = ({ blockActive }: RailwayPolylinesProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    const polylines: google.maps.Polyline[] = [];

    // 1. Render All Surveyed Real-World Mainline Tracks (Exact physical track curves)
    SURVEYED_MAINLINE_TRACKS.forEach((track) => {
      // Base ballast/casing line
      const ballastLine = new google.maps.Polyline({
        path: track.points,
        geodesic: true,
        strokeColor: '#0f172a',
        strokeOpacity: 0.6,
        strokeWeight: 6,
        map
      });
      polylines.push(ballastLine);

      // Core Steel Rail Line (High visibility)
      const railLine = new google.maps.Polyline({
        path: track.points,
        geodesic: true,
        strokeColor: '#38bdf8',
        strokeOpacity: 0.95,
        strokeWeight: 3.5,
        map
      });
      polylines.push(railLine);
    });

    // 2. Render Real-World Crossover Turnouts & Merging Switches (Where tracks cross and merge!)
    SURVEYED_CROSSOVER_SWITCHES.forEach((crossover) => {
      const switchLine = new google.maps.Polyline({
        path: crossover.points,
        geodesic: true,
        strokeColor: '#f59e0b', // Vibrant Gold for turnout switches
        strokeOpacity: 0.95,
        strokeWeight: 3.5,
        map
      });
      polylines.push(switchLine);
    });

    // 3. Render Station Platform Loop Lines (Loops at Tambaram, Egmore, Chengalpattu)
    SURVEYED_PLATFORM_LOOPS.forEach((loop) => {
      const loopLine = new google.maps.Polyline({
        path: loop.points,
        geodesic: true,
        strokeColor: '#94a3b8', // Silver loop lines
        strokeOpacity: 0.8,
        strokeWeight: 2.5,
        map
      });
      polylines.push(loopLine);
    });

    // 4. Maintenance Block Segment (between Tambaram 12.9256 and Chromepet 12.9517)
    let blockPolylines: google.maps.Polyline[] = [];
    if (blockActive) {
      // Find track points between Tambaram and Chromepet
      const blockedTracks = SURVEYED_MAINLINE_TRACKS.filter((t) =>
        t.points.some(
          (p) => p.lat >= 12.925 && p.lat <= 12.952 && p.lng >= 80.115 && p.lng <= 80.145
        )
      );

      blockedTracks.slice(0, 3).forEach((bt) => {
        const hazardGlow = new google.maps.Polyline({
          path: bt.points,
          geodesic: true,
          strokeColor: '#ef4444',
          strokeOpacity: 0.5,
          strokeWeight: 14,
          map
        });
        const hazardLine = new google.maps.Polyline({
          path: bt.points,
          geodesic: true,
          strokeColor: '#dc2626',
          strokeOpacity: 1.0,
          strokeWeight: 5,
          map
        });
        blockPolylines.push(hazardGlow, hazardLine);
      });
    }

    return () => {
      polylines.forEach((p) => p.setMap(null));
      blockPolylines.forEach((p) => p.setMap(null));
    };
  }, [map, blockActive]);

  return null;
};
