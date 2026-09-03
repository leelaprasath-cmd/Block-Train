import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { UP_MAIN_LINE, DOWN_MAIN_LINE, FAST_LINE } from '../../data/realTracksData';

interface RailwayPolylinesProps {
  blockActive: boolean;
}

export const RailwayPolylines = ({ blockActive }: RailwayPolylinesProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps) return;

    // Up Main Line (Silver/Steel with subtle glow)
    const upPolyline = new google.maps.Polyline({
      path: UP_MAIN_LINE,
      geodesic: true,
      strokeColor: '#38bdf8',
      strokeOpacity: 0.85,
      strokeWeight: 4,
      map
    });

    // Down Main Line (Electric Cyan)
    const downPolyline = new google.maps.Polyline({
      path: DOWN_MAIN_LINE,
      geodesic: true,
      strokeColor: '#0ea5e9',
      strokeOpacity: 0.85,
      strokeWeight: 4,
      map
    });

    // Fast Line (Amber / High Speed)
    const fastPolyline = new google.maps.Polyline({
      path: FAST_LINE,
      geodesic: true,
      strokeColor: '#f59e0b',
      strokeOpacity: 0.75,
      strokeWeight: 3.5,
      map
    });

    // Maintenance Block Segment (between Tambaram and Chromepet on UP line)
    // Points index ~12 to 14
    let blockPolyline: google.maps.Polyline | null = null;
    let blockBallast: google.maps.Polyline | null = null;

    if (blockActive) {
      const blockPath = UP_MAIN_LINE.slice(11, 15);
      
      blockBallast = new google.maps.Polyline({
        path: blockPath,
        geodesic: true,
        strokeColor: '#ef4444',
        strokeOpacity: 0.4,
        strokeWeight: 14,
        map
      });

      blockPolyline = new google.maps.Polyline({
        path: blockPath,
        geodesic: true,
        strokeColor: '#dc2626',
        strokeOpacity: 1.0,
        strokeWeight: 6,
        map
      });
    }

    return () => {
      upPolyline.setMap(null);
      downPolyline.setMap(null);
      fastPolyline.setMap(null);
      if (blockPolyline) blockPolyline.setMap(null);
      if (blockBallast) blockBallast.setMap(null);
    };
  }, [map, blockActive]);

  return null;
};
