import {
  TRAIN_ARC_LENGTHS,
  TOTAL_CORRIDOR_ARC_LENGTH,
  TrackPoint
} from '../../data/cglToMasTracks';

export interface ArticulatedCar {
  x: number;
  y: number;
  angle: number; // degrees
}

export interface ArticulatedTrainState {
  locomotive: ArticulatedCar;
  coaches: ArticulatedCar[];
}

// Binary search to find segment index for arc length s
const findSegmentIndex = (s: number): number => {
  let low = 0;
  let high = TRAIN_ARC_LENGTHS.length - 2;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (TRAIN_ARC_LENGTHS[mid] <= s) {
      if (mid === TRAIN_ARC_LENGTHS.length - 2 || TRAIN_ARC_LENGTHS[mid + 1] > s) {
        return mid;
      }
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return 0;
};

// Sample point and smooth lookahead tangent along the track
export const getPointAndTangent = (
  track: TrackPoint[],
  s: number,
  lookahead: number = 18
): ArticulatedCar => {
  let wrappedS = s % TOTAL_CORRIDOR_ARC_LENGTH;
  if (wrappedS < 0) wrappedS += TOTAL_CORRIDOR_ARC_LENGTH;

  const idx = findSegmentIndex(wrappedS);
  const s0 = TRAIN_ARC_LENGTHS[idx];
  const s1 = TRAIN_ARC_LENGTHS[idx + 1] || s0 + 1;
  const t = Math.min(Math.max((wrappedS - s0) / (s1 - s0), 0), 1);

  const p0 = track[idx] || track[0];
  const p1 = track[idx + 1] || p0;

  const x = p0.x + t * (p1.x - p0.x);
  const y = p0.y + t * (p1.y - p0.y);

  // Stable lookahead tangent to prevent any angle shaking
  let sFwd = (wrappedS + lookahead) % TOTAL_CORRIDOR_ARC_LENGTH;
  let sBwd = (wrappedS - lookahead + TOTAL_CORRIDOR_ARC_LENGTH) % TOTAL_CORRIDOR_ARC_LENGTH;

  const idxFwd = findSegmentIndex(sFwd);
  const idxBwd = findSegmentIndex(sBwd);

  const pFwd0 = track[idxFwd] || track[0];
  const pFwd1 = track[idxFwd + 1] || pFwd0;
  const tFwd = (sFwd - TRAIN_ARC_LENGTHS[idxFwd]) / ((TRAIN_ARC_LENGTHS[idxFwd + 1] || sFwd + 1) - TRAIN_ARC_LENGTHS[idxFwd]);
  const xFwd = pFwd0.x + tFwd * (pFwd1.x - pFwd0.x);
  const yFwd = pFwd0.y + tFwd * (pFwd1.y - pFwd0.y);

  const pBwd0 = track[idxBwd] || track[0];
  const pBwd1 = track[idxBwd + 1] || pBwd0;
  const tBwd = (sBwd - TRAIN_ARC_LENGTHS[idxBwd]) / ((TRAIN_ARC_LENGTHS[idxBwd + 1] || sBwd + 1) - TRAIN_ARC_LENGTHS[idxBwd]);
  const xBwd = pBwd0.x + tBwd * (pBwd1.x - pBwd0.x);
  const yBwd = pBwd0.y + tBwd * (pBwd1.y - pBwd0.y);

  const angleRad = Math.atan2(yFwd - yBwd, xFwd - xBwd);
  const angle = (angleRad * 180) / Math.PI;

  return { x, y, angle };
};

// Calculate articulated train state where each coach bends along the track curve independently
export const getArticulatedTrain = (
  track: TrackPoint[],
  headDistance: number,
  coachCount: number = 4,
  carSpacing: number = 28
): ArticulatedTrainState => {
  const locomotive = getPointAndTangent(track, headDistance, 20);
  const coaches: ArticulatedCar[] = [];

  for (let i = 1; i <= coachCount; i++) {
    const coachDist = headDistance - i * carSpacing;
    coaches.push(getPointAndTangent(track, coachDist, 18));
  }

  return { locomotive, coaches };
};

// Convert track points to smooth SVG path string
export const trackToSvgPath = (points: TrackPoint[]): string => {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  return d;
};
