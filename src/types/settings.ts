export enum DistanceUnit {
  KILOMETERS = 'km',
  MILES = 'mi'
}

export enum ElevationUnit {
  METERS = 'm',
  FEET = 'ft'
}

export enum PaceUnit {
  KM_PER_HOUR = 'km/h',
  MIN_PER_KM = 'min/km',
  MIN_PER_MILE = 'min/mi',
  MILES_PER_HOUR = 'mph'
}

export enum VolumeUnit {
  MILLILITERS = 'ml',
  OUNCES = 'oz'
}

export interface Settings {
  distanceUnit: DistanceUnit;
  elevationUnit: ElevationUnit;
  paceUnit: PaceUnit;
  volumeUnit: VolumeUnit;
} 