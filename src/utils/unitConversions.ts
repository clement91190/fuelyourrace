import { DistanceUnit, ElevationUnit, PaceUnit } from '../types/settings';

// Distance conversions
export function convertDistance(value: number, from: DistanceUnit, to: DistanceUnit): number {
  if (from === to) return value;
  return from === DistanceUnit.KILOMETERS ? value * 0.621371 : value * 1.60934;
}

// Elevation conversions
export function convertElevation(value: number, from: ElevationUnit, to: ElevationUnit): number {
  if (from === to) return value;
  return from === ElevationUnit.METERS ? value * 3.28084 : value * 0.3048;
}

// Pace conversions
export function convertPace(value: number, from: PaceUnit, to: PaceUnit): number {
  if (from === to) return value;

  // First convert to min/km as base unit
  let baseValue: number;
  switch (from) {
    case PaceUnit.KM_PER_HOUR:
      baseValue = 60 / value;
      break;
    case PaceUnit.MIN_PER_KM:
      baseValue = value;
      break;
    case PaceUnit.MIN_PER_MILE:
      baseValue = value / 1.60934;
      break;
    case PaceUnit.MILES_PER_HOUR:
      baseValue = 60 / (value * 1.60934);
      break;
    default:
      return value;
  }

  // Then convert from min/km to target unit
  switch (to) {
    case PaceUnit.KM_PER_HOUR:
      return 60 / baseValue;
    case PaceUnit.MIN_PER_KM:
      return baseValue;
    case PaceUnit.MIN_PER_MILE:
      return baseValue * 1.60934;
    case PaceUnit.MILES_PER_HOUR:
      return 60 / (baseValue * 1.60934);
    default:
      return value;
  }
}

export function formatPace(value: number, unit: PaceUnit): string {
  switch (unit) {
    case PaceUnit.MIN_PER_KM:
    case PaceUnit.MIN_PER_MILE:
      const minutes = Math.floor(value);
      const seconds = Math.round((value - minutes) * 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    default:
      return value.toFixed(1);
  }
}

export function formatDistance(value: number, unit: DistanceUnit): string {
  return `${value.toFixed(1)}${unit}`;
}

export function formatElevation(value: number, unit: ElevationUnit): string {
  return `${Math.round(value)}${unit}`;
} 