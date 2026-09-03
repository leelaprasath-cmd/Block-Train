import {
  CONTINUOUS_TRACK_SPLINE,
  TRACK_ARC_LENGTHS,
  TOTAL_TRACK_ARC_LENGTH,
  CanvasPoint
} from '../../data/surveyedRailwayNetwork';

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
  let high = TRACK_ARC_LENGTHS.length - 2;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (TRACK_ARC_LENGTHS[mid] <= s) {
      if (mid === TRACK_ARC_LENGTHS.length - 2 || TRACK_ARC_LENGTHS[mid + 1] > s) {
        return mid;
      }
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return 0;
};

// Get smooth point and stable lookahead tangent at arc length distance s
export const getPointAndTangent = (s: number, lookahead: number = 22): ArticulatedCar => {
  // Wrap around corridor bounds
  let wrappedS = s % TOTAL_TRACK_ARC_LENGTH;
  if (wrappedS < 0) wrappedS += TOTAL_TRACK_ARC_LENGTH;

  const idx = findSegmentIndex(wrappedS);
  const s0 = TRACK_ARC_LENGTHS[idx];
  const s1 = TRACK_ARC_LENGTHS[idx + 1] || s0 + 1;
  const t = Math.min(Math.max((wrappedS - s0) / (s1 - s0), 0), 1);

  const p0 = CONTINUOUS_TRACK_SPLINE[idx];
  const p1 = CONTINUOUS_TRACK_SPLINE[idx + 1] || p0;

  const x = p0.x + t * (p1.x - p0.x);
  const y = p0.y + t * (p1.y - p0.y);

  // For butter-smooth, non-shaking tangent, sample forward and backward along spline
  let sFwd = (wrappedS + lookahead) % TOTAL_TRACK_ARC_LENGTH;
  let sBwd = (wrappedS - lookahead + TOTAL_TRACK_ARC_LENGTH) % TOTAL_TRACK_ARC_LENGTH;

  const idxFwd = findSegmentIndex(sFwd);
  const idxBwd = findSegmentIndex(sBwd);

  const pFwd0 = CONTINUOUS_TRACK_SPLINE[idxFwd];
  const pFwd1 = CONTINUOUS_TRACK_SPLINE[idxFwd + 1] || pFwd0;
  const tFwd = (sFwd - TRACK_ARC_LENGTHS[idxFwd]) / ((TRACK_ARC_LENGTHS[idxFwd + 1] || sFwd + 1) - TRACK_ARC_LENGTHS[idxFwd]);
  const xFwd = pFwd0.x + tFwd * (pFwd1.x - pFwd0.x);
  const yFwd = pFwd0.y + tFwd * (pFwd1.y - pFwd0.y);

  const pBwd0 = CONTINUOUS_TRACK_SPLINE[idxBwd];
  const pBwd1 = CONTINUOUS_TRACK_SPLINE[idxBwd + 1] || pBwd0;
  const tBwd = (sBwd - TRACK_ARC_LENGTHS[idxBwd]) / ((TRACK_ARC_LENGTHS[idxBwd + 1] || sBwd + 1) - TRACK_ARC_LENGTHS[idxBwd]);
  const xBwd = pBwd0.x + tBwd * (pBwd1.x - pBwd0.x);
  const yBwd = pBwd0.y + tBwd * (pBwd1.y - pBwd0.y);

  const angleRad = Math.atan2(yFwd - yBwd, xFwd - xBwd);
  const angle = (angleRad * 180) / Math.PI;

  return { x, y, angle };
};

// Calculate articulated train state where each coach bends independently along track curves
export const getArticulatedTrain = (
  headDistance: number,
  coachCount: number = 4,
  carSpacing: number = 36
): ArticulatedTrainState => {
  const locomotive = getPointAndTangent(headDistance, 25);
  const coaches: ArticulatedCar[] = [];

  for (let i = 1; i <= coachCount; i++) {
    const coachDist = headDistance - i * carSpacing;
    coaches.push(getPointAndTangent(coachDist, 22));
  }

  return { locomotive, coaches };
};

// Svg path generator for surveyed tracks
export const pointsToSvgPath = (points: CanvasPoint[]): string => {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`;
  }
  return d;
};
