import { RaceProfile } from '../types';

export const utmbProfile: RaceProfile = {
  id: 'utmb-2024',
  name: 'UTMB 2024',
  totalDistance: 171.5,
  totalElevationGain: 10000,
  totalElevationLoss: 10000,
  startLocation: 'Chamonix',
  finishLocation: 'Chamonix',
  startElevation: 1043,
  aidStations: [
    {
      id: 'start',
      name: 'Start Line',
      distanceFromStart: 0,
      elevationFromStart: 0,
      currentElevation: 1043,
      estimatedTimeFromStart: '00:00:00',
      assistanceAllowed: true,
      foodItems: []
    },
    {
      id: 'les-contamines',
      name: 'Les Contamines Montjoie',
      distanceFromStart: 31.7,
      elevationFromStart: 1400,
      currentElevation: 1162,
      estimatedTimeFromStart: '02:44:30',
      assistanceAllowed: true,
      foodItems: []
    },
    {
      id: 'courmayeur',
      name: 'Courmayeur',
      distanceFromStart: 79.0,
      elevationFromStart: 3900,
      currentElevation: 1191,
      estimatedTimeFromStart: '08:42:00',
      assistanceAllowed: true,
      foodItems: []
    },
    {
      id: 'champex-lac',
      name: 'Champex-Lac',
      distanceFromStart: 121.5,
      elevationFromStart: 5700,
      currentElevation: 1479,
      estimatedTimeFromStart: '14:00:57',
      assistanceAllowed: true,
      foodItems: []
    },
    {
      id: 'vallorcine',
      name: 'Vallorcine',
      distanceFromStart: 150.0,
      elevationFromStart: 7200,
      currentElevation: 1265,
      estimatedTimeFromStart: '17:31:26',
      assistanceAllowed: true,
      foodItems: []
    },
    {
      id: 'finish',
      name: 'Finish Line',
      distanceFromStart: 171.5,
      elevationFromStart: 10000,
      currentElevation: 1043,
      estimatedTimeFromStart: '19:54:23',
      assistanceAllowed: true,
      foodItems: []
    }
  ]
}; 