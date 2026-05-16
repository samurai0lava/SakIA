/** Shared mock constants for cooperative well telemetry */

export const WELL_DEPTH_M = 68;
export const WELL_DEPTH_TREND = '-4m this season';
export const SALINITY_EC = 2.4;
export const ENERGY_SAVED_KWH = 1240;

export const RECHARGE_SERIES = [
  { time: '06:00', rate: 0.12 },
  { time: '08:00', rate: 0.18 },
  { time: '10:00', rate: 0.22 },
  { time: '12:00', rate: 0.15 },
  { time: '14:00', rate: 0.09 },
  { time: '16:00', rate: 0.14 },
  { time: '18:00', rate: 0.21 },
  { time: 'Now', rate: 0.19 },
];

export const SOIL_TYPES = ['Clay-Loam', 'Sandy', 'Silty'];

export const CROP_RECOMMENDATIONS = [
  {
    rank: 1,
    name: 'Quinoa',
    match: 94,
    status: 'recommended',
    reason:
      'Highly tolerant to current 2.4 dS/m well salinity. Maximizes cash yield per liter.',
  },
  {
    rank: 2,
    name: 'Olives',
    match: 88,
    status: 'recommended',
    reason:
      'Low water requirement matches summer well discharge velocity constraint.',
  },
  {
    rank: 3,
    name: 'Mint',
    match: 41,
    status: 'rejected',
    reason:
      'Water-intensive profile exceeds cooperative well quota limits.',
  },
];

/** Initial DRR queue — 4 plots sharing one borehole */
export const INITIAL_QUEUE = [
  {
    plotId: 1,
    farmer: 'Amine',
    soilMoisture: 28,
    deficit: 72,
    priority: 'high',
    status: 'next',
    valveOpen: false,
  },
  {
    plotId: 2,
    farmer: 'Karim',
    soilMoisture: 42,
    deficit: 58,
    priority: 'medium',
    status: 'waiting',
    valveOpen: false,
  },
  {
    plotId: 3,
    farmer: 'Fatima',
    soilMoisture: 14,
    deficit: 86,
    priority: 'critical',
    status: 'active',
    valveOpen: true,
  },
  {
    plotId: 4,
    farmer: 'Youssef',
    soilMoisture: 65,
    deficit: 35,
    priority: 'low',
    status: 'waiting',
    valveOpen: false,
  },
];
