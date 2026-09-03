export interface GeoStation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  platforms: number;
  division: string;
  type: 'terminal' | 'junction' | 'suburban';
}

// True GPS Coordinates of Southern Railway Mainline Corridor
export const REAL_STATIONS: GeoStation[] = [
  { id: 'CGL', code: 'CGL', name: 'Chengalpattu Junction', lat: 12.6917, lng: 79.9806, platforms: 8, division: 'MAS', type: 'junction' },
  { id: 'SKL', code: 'SKL', name: 'Singaperumal Koil', lat: 12.7634, lng: 80.0039, platforms: 5, division: 'MAS', type: 'suburban' },
  { id: 'MMNK', code: 'MMNK', name: 'Maraimalai Nagar', lat: 12.7981, lng: 80.0247, platforms: 3, division: 'MAS', type: 'suburban' },
  { id: 'GI', code: 'GI', name: 'Guduvancheri', lat: 12.8453, lng: 80.0631, platforms: 4, division: 'MAS', type: 'suburban' },
  { id: 'VDR', code: 'VDR', name: 'Vandalur', lat: 12.8906, lng: 80.0818, platforms: 3, division: 'MAS', type: 'suburban' },
  { id: 'PRGL', code: 'PRGL', name: 'Perungalathur', lat: 12.9056, lng: 80.0984, platforms: 3, division: 'MAS', type: 'suburban' },
  { id: 'TBM', code: 'TBM', name: 'Tambaram', lat: 12.9256, lng: 80.1171, platforms: 9, division: 'MAS', type: 'terminal' },
  { id: 'CMP', code: 'CMP', name: 'Chromepet', lat: 12.9517, lng: 80.1411, platforms: 4, division: 'MAS', type: 'suburban' },
  { id: 'PV', code: 'PV', name: 'Pallavaram', lat: 12.9678, lng: 80.1492, platforms: 5, division: 'MAS', type: 'suburban' },
  { id: 'STM', code: 'STM', name: 'St. Thomas Mount', lat: 12.9961, lng: 80.1983, platforms: 5, division: 'MAS', type: 'junction' },
  { id: 'GDY', code: 'GDY', name: 'Guindy', lat: 13.0089, lng: 80.2132, platforms: 4, division: 'MAS', type: 'suburban' },
  { id: 'MBM', code: 'MBM', name: 'Mambalam', lat: 13.0336, lng: 80.2285, platforms: 4, division: 'MAS', type: 'suburban' },
  { id: 'NBK', code: 'NBK', name: 'Nungambakkam', lat: 13.0617, lng: 80.2389, platforms: 4, division: 'MAS', type: 'suburban' },
  { id: 'MS', code: 'MS', name: 'Chennai Egmore', lat: 13.0827, lng: 80.2612, platforms: 11, division: 'MAS', type: 'terminal' },
  { id: 'MAS', code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2755, platforms: 17, division: 'MAS', type: 'terminal' }
];

// Detailed Real Railway Track Path with Intermediate Curvature Waypoints along the GST Corridor
export const REAL_TRACK_WAYPOINTS: { lat: number; lng: number }[] = [
  { lat: 12.6917, lng: 79.9806 }, // Chengalpattu
  { lat: 12.7150, lng: 79.9880 },
  { lat: 12.7420, lng: 79.9960 },
  { lat: 12.7634, lng: 80.0039 }, // Singaperumal Koil
  { lat: 12.7820, lng: 80.0140 },
  { lat: 12.7981, lng: 80.0247 }, // Maraimalai Nagar
  { lat: 12.8210, lng: 80.0430 },
  { lat: 12.8453, lng: 80.0631 }, // Guduvancheri
  { lat: 12.8680, lng: 80.0720 },
  { lat: 12.8906, lng: 80.0818 }, // Vandalur
  { lat: 12.9056, lng: 80.0984 }, // Perungalathur
  { lat: 12.9160, lng: 80.1080 },
  { lat: 12.9256, lng: 80.1171 }, // Tambaram
  { lat: 12.9380, lng: 80.1290 },
  { lat: 12.9517, lng: 80.1411 }, // Chromepet
  { lat: 12.9678, lng: 80.1492 }, // Pallavaram
  { lat: 12.9820, lng: 80.1740 },
  { lat: 12.9961, lng: 80.1983 }, // St. Thomas Mount
  { lat: 13.0089, lng: 80.2132 }, // Guindy
  { lat: 13.0210, lng: 80.2210 },
  { lat: 13.0336, lng: 80.2285 }, // Mambalam
  { lat: 13.0480, lng: 80.2330 },
  { lat: 13.0617, lng: 80.2389 }, // Nungambakkam
  { lat: 13.0720, lng: 80.2490 },
  { lat: 13.0827, lng: 80.2612 }, // Chennai Egmore
  { lat: 13.0835, lng: 80.2680 },
  { lat: 13.0827, lng: 80.2755 }  // Chennai Central
];

import { CONTINUOUS_SURVEYED_CORRIDOR } from './exactSurveyedTracks';

// Generate parallel lines for Up Line, Down Line, and Fast Line using real surveyed alignment
export const getOffsetPolyline = (points: { lat: number; lng: number }[], offsetDistance: number) => {
  return points.map((p, i) => {
    const next = points[i + 1] || p;
    const prev = points[i - 1] || p;
    const dLat = next.lat - prev.lat;
    const dLng = next.lng - prev.lng;
    const length = Math.sqrt(dLat * dLat + dLng * dLng) || 1;
    // Perpendicular normal vector
    const nLat = -dLng / length;
    const nLng = dLat / length;
    return {
      lat: Number((p.lat + nLat * offsetDistance).toFixed(6)),
      lng: Number((p.lng + nLng * offsetDistance).toFixed(6))
    };
  });
};

export const UP_MAIN_LINE = getOffsetPolyline(CONTINUOUS_SURVEYED_CORRIDOR, -0.000035);
export const DOWN_MAIN_LINE = getOffsetPolyline(CONTINUOUS_SURVEYED_CORRIDOR, 0.000035);
export const FAST_LINE = getOffsetPolyline(CONTINUOUS_SURVEYED_CORRIDOR, 0.000095);

// Real Moving Train definitions mapped to GPS
export interface RealGpsTrain {
  id: string;
  name: string;
  type: 'vande_bharat' | 'express' | 'suburban' | 'freight';
  speedKmH: number;
  direction: 1 | -1; // 1 = UP (towards Chennai Central), -1 = DOWN (towards Chengalpattu)
  trackType: 'UP' | 'DOWN' | 'FAST';
  color: string;
  locoType: string;
  rakeComposition: string;
  fromStation: string;
  toStation: string;
}

export const REAL_GPS_TRAIN_PRESETS: RealGpsTrain[] = [
  {
    id: '20643',
    name: 'Vande Bharat Express',
    type: 'vande_bharat',
    speedKmH: 130,
    direction: 1,
    trackType: 'FAST',
    color: '#2563eb',
    locoType: 'WMS Trainset 18',
    rakeComposition: '16 Coaches (Executive & Chair Car)',
    fromStation: 'Coimbatore Jn (CBE)',
    toStation: 'Chennai Central (MAS)'
  },
  {
    id: '12638',
    name: 'Pandian Superfast Express',
    type: 'express',
    speedKmH: 110,
    direction: 1,
    trackType: 'UP',
    color: '#ef4444',
    locoType: 'WAP-7 RPM Shed',
    rakeComposition: '24 LHB Coaches',
    fromStation: 'Madurai Jn (MDU)',
    toStation: 'Chennai Egmore (MS)'
  },
  {
    id: '40012',
    name: 'Tambaram - Beach EMU Local',
    type: 'suburban',
    speedKmH: 75,
    direction: 1,
    trackType: 'UP',
    color: '#0284c7',
    locoType: 'Medha 3-Phase EMU',
    rakeComposition: '12 Car Suburban Rake',
    fromStation: 'Tambaram (TBM)',
    toStation: 'Chennai Beach (MSB)'
  },
  {
    id: '40015',
    name: 'Beach - Chengalpattu EMU Local',
    type: 'suburban',
    speedKmH: 75,
    direction: -1,
    trackType: 'DOWN',
    color: '#0284c7',
    locoType: 'BHEL Retrofitted EMU',
    rakeComposition: '12 Car Suburban Rake',
    fromStation: 'Chennai Beach (MSB)',
    toStation: 'Chengalpattu Jn (CGL)'
  },
  {
    id: '66042',
    name: 'CONCOR Container Freight Express',
    type: 'freight',
    speedKmH: 60,
    direction: -1,
    trackType: 'DOWN',
    color: '#059669',
    locoType: 'Twin WAG-9HC Electric',
    rakeComposition: '45 BLC Wagons (ISO Containers)',
    fromStation: 'Chennai Port (CPT)',
    toStation: 'Whitefield Concor Yard'
  }
];
