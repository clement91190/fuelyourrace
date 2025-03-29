/// <reference types="jest" />
import { parseLiveTrailXml } from '@/lib/liveTrail/parser';
import fs from 'fs';
import path from 'path';

describe('parseLiveTrailXml', () => {
  let exampleData: string;

  beforeAll(() => {
    const filePath = path.join(__dirname, 'example_data.xml');
    exampleData = fs.readFileSync(filePath, 'utf-8');
  });

  it('should parse the XML data correctly', () => {
    const result = parseLiveTrailXml(exampleData);

    // Test basic structure
    expect(result).toHaveProperty('aidStations');
    expect(result).toHaveProperty('totalDistance');
    expect(result).toHaveProperty('totalElevationGain');

    // Test aid stations array
    expect(Array.isArray(result.aidStations)).toBe(true);
    expect(result.aidStations.length).toBeGreaterThan(0);

    // Test first aid station
    const firstStation = result.aidStations[0];
    expect(firstStation).toMatchObject({
      name: 'Start - China Wall',
      distanceFromStart: 0,
      elevationFromStart: 0,
      currentElevation: 1529,
      estimatedTimeFromStart: '00:00:00'
    });

    // Test last aid station
    const lastStation = result.aidStations[result.aidStations.length - 1];
    expect(lastStation).toMatchObject({
      name: 'Finish - Auburn',
      distanceFromStart: 100.22,
      currentElevation: 386,
      elevationFromStart: 4064,
      estimatedTimeFromStart: '09:10:10'
    });

    // Test total distance and elevation gain
    expect(result.totalDistance).toBeCloseTo(100.22, 2);
    expect(result.totalElevationGain).toBe(4064);
  });

  it('should handle missing data gracefully', () => {
    const invalidXml = '<d><pts><pt idpt="0" n="Test" km="0" d="0" a="1000" /></pts></d>';
    const result = parseLiveTrailXml(invalidXml);

    expect(result.aidStations).toHaveLength(1);
    expect(result.aidStations[0]).toMatchObject({
      name: 'Test',
      distanceFromStart: 0,
      elevationFromStart: 0,
      currentElevation: 1000,
      estimatedTimeFromStart: '00:00:00'
    });
  });

  it('should throw error for invalid XML', () => {
    expect(() => parseLiveTrailXml('invalid xml')).toThrow();
  });

  it('should throw error for XML without timing points', () => {
    const xmlWithoutPoints = '<d><pts></pts></d>';
    expect(() => parseLiveTrailXml(xmlWithoutPoints)).toThrow('No timing points found');
  });
}); 