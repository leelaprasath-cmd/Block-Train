export interface StationScheduleItem {
  stationCode: string;
  stationName: string;
  distanceKm: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  platform: string;
  haltMinutes: number;
}

export interface WimtTrainSchedule {
  trainNumber: string;
  trainName: string;
  trainType: 'Vande Bharat' | 'Superfast Express' | 'Suburban EMU' | 'Container Freight';
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
  totalDistanceKm: number;
  avgSpeedKmH: number;
  topSpeedKmH: number;
  locoClass: string;
  daysOfOperation: string;
  schedule: StationScheduleItem[];
}

export const WIMT_TRAIN_SCHEDULES: Record<string, WimtTrainSchedule> = {
  '20643': {
    trainNumber: '20643',
    trainName: 'Coimbatore - Chennai Central Vande Bharat Express',
    trainType: 'Vande Bharat',
    origin: 'Coimbatore Junction',
    originCode: 'CBE',
    destination: 'MGR Chennai Central',
    destinationCode: 'MAS',
    totalDistanceKm: 495,
    avgSpeedKmH: 85,
    topSpeedKmH: 130,
    locoClass: 'Trainset 18 (25kV AC)',
    daysOfOperation: 'Except Wed',
    schedule: [
      { stationCode: 'CGL', stationName: 'Chengalpattu Junction', distanceKm: 435, scheduledArrival: '10:48', scheduledDeparture: '10:50', platform: 'PF 1', haltMinutes: 2 },
      { stationCode: 'SKL', stationName: 'Singaperumal Koil', distanceKm: 443, scheduledArrival: '10:56', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'MMNK', stationName: 'Maraimalai Nagar', distanceKm: 447, scheduledArrival: '11:00', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'GI', stationName: 'Guduvancheri', distanceKm: 452, scheduledArrival: '11:04', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'VDR', stationName: 'Vandalur', distanceKm: 457, scheduledArrival: '11:08', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'PRGL', stationName: 'Perungalathur', distanceKm: 460, scheduledArrival: '11:11', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'TBM', stationName: 'Tambaram', distanceKm: 467, scheduledArrival: '11:18', scheduledDeparture: '11:20', platform: 'PF 7', haltMinutes: 2 },
      { stationCode: 'CMP', stationName: 'Chromepet', distanceKm: 471, scheduledArrival: '11:24', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'PV', stationName: 'Pallavaram', distanceKm: 473, scheduledArrival: '11:26', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'STM', stationName: 'St. Thomas Mount', distanceKm: 477, scheduledArrival: '11:30', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'GDY', stationName: 'Guindy', distanceKm: 480, scheduledArrival: '11:34', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'MBM', stationName: 'Mambalam', distanceKm: 484, scheduledArrival: '11:39', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'NBK', stationName: 'Nungambakkam', distanceKm: 487, scheduledArrival: '11:43', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'MS', stationName: 'Chennai Egmore', distanceKm: 492, scheduledArrival: '11:50', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'MAS', stationName: 'MGR Chennai Central', distanceKm: 495, scheduledArrival: '11:58', scheduledDeparture: 'Ends', platform: 'PF 2', haltMinutes: 0 }
    ]
  },
  '12638': {
    trainNumber: '12638',
    trainName: 'Pandian Superfast Express',
    trainType: 'Superfast Express',
    origin: 'Madurai Junction',
    originCode: 'MDU',
    destination: 'Chennai Egmore',
    destinationCode: 'MS',
    totalDistanceKm: 493,
    avgSpeedKmH: 68,
    topSpeedKmH: 110,
    locoClass: 'WAP-7 RPM Shed',
    daysOfOperation: 'Daily',
    schedule: [
      { stationCode: 'CGL', stationName: 'Chengalpattu Junction', distanceKm: 437, scheduledArrival: '04:08', scheduledDeparture: '04:10', platform: 'PF 4', haltMinutes: 2 },
      { stationCode: 'SKL', stationName: 'Singaperumal Koil', distanceKm: 445, scheduledArrival: '04:18', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'MMNK', stationName: 'Maraimalai Nagar', distanceKm: 449, scheduledArrival: '04:22', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'GI', stationName: 'Guduvancheri', distanceKm: 454, scheduledArrival: '04:27', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'VDR', stationName: 'Vandalur', distanceKm: 459, scheduledArrival: '04:32', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'PRGL', stationName: 'Perungalathur', distanceKm: 462, scheduledArrival: '04:36', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'TBM', stationName: 'Tambaram', distanceKm: 466, scheduledArrival: '04:43', scheduledDeparture: '04:45', platform: 'PF 5', haltMinutes: 2 },
      { stationCode: 'CMP', stationName: 'Chromepet', distanceKm: 470, scheduledArrival: '04:50', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'PV', stationName: 'Pallavaram', distanceKm: 472, scheduledArrival: '04:52', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'STM', stationName: 'St. Thomas Mount', distanceKm: 476, scheduledArrival: '04:57', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'GDY', stationName: 'Guindy', distanceKm: 479, scheduledArrival: '05:01', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'MBM', stationName: 'Mambalam', distanceKm: 483, scheduledArrival: '05:08', scheduledDeparture: '05:10', platform: 'PF 3', haltMinutes: 2 },
      { stationCode: 'NBK', stationName: 'Nungambakkam', distanceKm: 486, scheduledArrival: '05:15', scheduledDeparture: 'Pass', platform: 'Through', haltMinutes: 0 },
      { stationCode: 'MS', stationName: 'Chennai Egmore', distanceKm: 493, scheduledArrival: '05:30', scheduledDeparture: 'Ends', platform: 'PF 4', haltMinutes: 0 }
    ]
  },
  '40012': {
    trainNumber: '40012',
    trainName: 'Tambaram - Chennai Beach EMU Local',
    trainType: 'Suburban EMU',
    origin: 'Tambaram',
    originCode: 'TBM',
    destination: 'Chennai Beach',
    destinationCode: 'MSB',
    totalDistanceKm: 29,
    avgSpeedKmH: 35,
    topSpeedKmH: 75,
    locoClass: 'Medha 3-Phase EMU',
    daysOfOperation: 'Daily',
    schedule: [
      { stationCode: 'TBM', stationName: 'Tambaram', distanceKm: 0, scheduledArrival: '15:10', scheduledDeparture: '15:10', platform: 'PF 1', haltMinutes: 0 },
      { stationCode: 'CMP', stationName: 'Chromepet', distanceKm: 4, scheduledArrival: '15:16', scheduledDeparture: '15:17', platform: 'PF 1', haltMinutes: 1 },
      { stationCode: 'PV', stationName: 'Pallavaram', distanceKm: 6, scheduledArrival: '15:19', scheduledDeparture: '15:20', platform: 'PF 1', haltMinutes: 1 },
      { stationCode: 'STM', stationName: 'St. Thomas Mount', distanceKm: 10, scheduledArrival: '15:25', scheduledDeparture: '15:26', platform: 'PF 1', haltMinutes: 1 },
      { stationCode: 'GDY', stationName: 'Guindy', distanceKm: 13, scheduledArrival: '15:30', scheduledDeparture: '15:31', platform: 'PF 1', haltMinutes: 1 },
      { stationCode: 'MBM', stationName: 'Mambalam', distanceKm: 17, scheduledArrival: '15:36', scheduledDeparture: '15:37', platform: 'PF 1', haltMinutes: 1 },
      { stationCode: 'NBK', stationName: 'Nungambakkam', distanceKm: 20, scheduledArrival: '15:42', scheduledDeparture: '15:43', platform: 'PF 1', haltMinutes: 1 },
      { stationCode: 'MS', stationName: 'Chennai Egmore', distanceKm: 25, scheduledArrival: '15:50', scheduledDeparture: '15:51', platform: 'PF 10', haltMinutes: 1 },
      { stationCode: 'MAS', stationName: 'Chennai Park / Central', distanceKm: 27, scheduledArrival: '15:55', scheduledDeparture: '15:56', platform: 'PF 1', haltMinutes: 1 }
    ]
  },
  '40015': {
    trainNumber: '40015',
    trainName: 'Chennai Beach - Chengalpattu EMU Local',
    trainType: 'Suburban EMU',
    origin: 'Chennai Beach',
    originCode: 'MSB',
    destination: 'Chengalpattu Junction',
    destinationCode: 'CGL',
    totalDistanceKm: 60,
    avgSpeedKmH: 38,
    topSpeedKmH: 75,
    locoClass: 'BHEL Retrofitted EMU',
    daysOfOperation: 'Daily',
    schedule: [
      { stationCode: 'MAS', stationName: 'Chennai Central / Park', distanceKm: 3, scheduledArrival: '16:05', scheduledDeparture: '16:06', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'MS', stationName: 'Chennai Egmore', distanceKm: 5, scheduledArrival: '16:11', scheduledDeparture: '16:12', platform: 'PF 11', haltMinutes: 1 },
      { stationCode: 'NBK', stationName: 'Nungambakkam', distanceKm: 10, scheduledArrival: '16:18', scheduledDeparture: '16:19', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'MBM', stationName: 'Mambalam', distanceKm: 13, scheduledArrival: '16:24', scheduledDeparture: '16:25', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'GDY', stationName: 'Guindy', distanceKm: 17, scheduledArrival: '16:30', scheduledDeparture: '16:31', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'STM', stationName: 'St. Thomas Mount', distanceKm: 20, scheduledArrival: '16:36', scheduledDeparture: '16:37', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'PV', stationName: 'Pallavaram', distanceKm: 24, scheduledArrival: '16:42', scheduledDeparture: '16:43', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'CMP', stationName: 'Chromepet', distanceKm: 26, scheduledArrival: '16:46', scheduledDeparture: '16:47', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'TBM', stationName: 'Tambaram', distanceKm: 30, scheduledArrival: '16:55', scheduledDeparture: '16:57', platform: 'PF 2', haltMinutes: 2 },
      { stationCode: 'PRGL', stationName: 'Perungalathur', distanceKm: 34, scheduledArrival: '17:02', scheduledDeparture: '17:03', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'VDR', stationName: 'Vandalur', distanceKm: 37, scheduledArrival: '17:07', scheduledDeparture: '17:08', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'GI', stationName: 'Guduvancheri', distanceKm: 42, scheduledArrival: '17:15', scheduledDeparture: '17:16', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'MMNK', stationName: 'Maraimalai Nagar', distanceKm: 47, scheduledArrival: '17:22', scheduledDeparture: '17:23', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'SKL', stationName: 'Singaperumal Koil', distanceKm: 51, scheduledArrival: '17:29', scheduledDeparture: '17:30', platform: 'PF 2', haltMinutes: 1 },
      { stationCode: 'CGL', stationName: 'Chengalpattu Junction', distanceKm: 60, scheduledArrival: '17:45', scheduledDeparture: 'Ends', platform: 'PF 3', haltMinutes: 0 }
    ]
  }
};
