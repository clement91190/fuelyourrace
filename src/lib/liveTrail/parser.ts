import { AidStation } from '@/types';

interface ParsedLiveTrailData {
  aidStations: AidStation[];
  totalDistance: number;
  totalElevationGain: number;
}


export function parseLiveTrailXml(xml: string): ParsedLiveTrailData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  
  // Get all points (aid stations)
  const points = Array.from(doc.querySelectorAll('pt')).map(pt => ({
    idpt: pt.getAttribute('idpt') || '',
    n: pt.getAttribute('n') || '',
    km: pt.getAttribute('km') || '0',
    d: pt.getAttribute('d') || '0',
    a: pt.getAttribute('a') || '0'
  }));

  // Get all pass times
  const passes = Array.from(doc.querySelectorAll('pass > e')).map(pass => ({
    idpt: pass.getAttribute('idpt') || '',
    tps: pass.getAttribute('tps') || '00:00:00'
  }));

  if (points.length === 0) {
    throw new Error('No timing points found');
  }

  // Parse each point into an aid station
  const aidStations: AidStation[] = points.map((point, index) => {
    // Find matching pass time
    const pass = passes.find(p => p.idpt === point.idpt);
    
    return {
      id: `station-${index}`,
      name: point.n,
      distanceFromStart: parseFloat(point.km),
      elevationFromStart: parseInt(point.d),
      currentElevation: parseInt(point.a),
      estimatedTimeFromStart: pass?.tps || '00:00:00',
      assistanceAllowed: true,
      foodItems: []
    } as AidStation;
  });

  // Calculate total distance and elevation gain
  if (aidStations.length === 0) {
    throw new Error('No aid stations found');
  }
  const lastStation = aidStations[aidStations.length - 1] as AidStation;
  const firstStation = aidStations[0] as AidStation;
  if (!lastStation || !firstStation) {
    throw new Error('Invalid aid stations array');
  }
  const totalDistance = lastStation.distanceFromStart;
  const totalElevationGain = lastStation.elevationFromStart;

  return {
    aidStations,
    totalDistance,
    totalElevationGain
  };
} 