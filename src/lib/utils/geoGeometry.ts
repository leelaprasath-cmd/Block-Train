export interface LatLng {
  lat: number;
  lng: number;
}

// Haversine distance in meters
export const getDistanceMeters = (p1: LatLng, p2: LatLng): number => {
  const R = 6371000; // Earth radius in meters
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Bearing in degrees (0 = North, 90 = East, 180 = South, 270 = West)
export const getBearingDegrees = (p1: LatLng, p2: LatLng): number => {
  const lat1 = (p1.lat * Math.PI) / 180;
  const lat2 = (p2.lat * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
};

// Interpolate position and heading along a polyline
export const interpolatePolyline = (
  points: LatLng[],
  progressRatio: number
): { position: LatLng; bearing: number } => {
  if (!points || points.length === 0) {
    return { position: { lat: 12.9256, lng: 80.1171 }, bearing: 0 };
  }
  if (points.length === 1) {
    return { position: points[0], bearing: 0 };
  }

  // Calculate segment lengths
  const segmentLengths: number[] = [];
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const len = getDistanceMeters(points[i], points[i + 1]);
    segmentLengths.push(len);
    totalLength += len;
  }

  // Clamp ratio between 0 and 1
  const clampedRatio = Math.max(0, Math.min(1, progressRatio));
  const targetDistance = clampedRatio * totalLength;

  let accumulated = 0;
  for (let i = 0; i < segmentLengths.length; i++) {
    const segLen = segmentLengths[i];
    if (accumulated + segLen >= targetDistance || i === segmentLengths.length - 1) {
      const segRatio = segLen > 0 ? (targetDistance - accumulated) / segLen : 0;
      const p1 = points[i];
      const p2 = points[i + 1];

      const lat = p1.lat + (p2.lat - p1.lat) * segRatio;
      const lng = p1.lng + (p2.lng - p1.lng) * segRatio;
      const bearing = getBearingDegrees(p1, p2);

      return { position: { lat, lng }, bearing };
    }
    accumulated += segLen;
  }

  return {
    position: points[points.length - 1],
    bearing: getBearingDegrees(points[points.length - 2], points[points.length - 1])
  };
};
