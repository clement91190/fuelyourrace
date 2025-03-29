import { atom } from 'nanostores';
import { Settings, DistanceUnit, ElevationUnit, PaceUnit, VolumeUnit } from '../types/settings';

export const settingsStore = atom<Settings>({
  distanceUnit: DistanceUnit.KILOMETERS,
  elevationUnit: ElevationUnit.METERS,
  paceUnit: PaceUnit.MIN_PER_KM,
  volumeUnit: VolumeUnit.MILLILITERS
});

export const updateSettings = (updates: Partial<Settings>) => {
  settingsStore.set({
    ...settingsStore.get(),
    ...updates
  });
}; 