import { Modal, Select, Stack } from '@mantine/core';
import { useStore } from '@nanostores/react';
import { settingsStore, updateSettings } from '@/store/settings';
import { DistanceUnit, ElevationUnit, PaceUnit } from '@/types/settings';

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  const settings = useStore(settingsStore);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Settings"
      size="sm"
    >
      <Stack>
        <Select
          label="Distance Unit"
          value={settings.distanceUnit}
          onChange={(value) => updateSettings({ distanceUnit: value as DistanceUnit })}
          data={[
            { value: DistanceUnit.KILOMETERS, label: 'Kilometers (km)' },
            { value: DistanceUnit.MILES, label: 'Miles (mi)' },
          ]}
        />

        <Select
          label="Elevation Unit"
          value={settings.elevationUnit}
          onChange={(value) => updateSettings({ elevationUnit: value as ElevationUnit })}
          data={[
            { value: ElevationUnit.METERS, label: 'Meters (m)' },
            { value: ElevationUnit.FEET, label: 'Feet (ft)' },
          ]}
        />

        <Select
          label="Pace Unit"
          value={settings.paceUnit}
          onChange={(value) => updateSettings({ paceUnit: value as PaceUnit })}
          data={[
            { value: PaceUnit.MIN_PER_KM, label: 'Minutes per kilometer (min/km)' },
            { value: PaceUnit.MIN_PER_MILE, label: 'Minutes per mile (min/mi)' },
            { value: PaceUnit.KM_PER_HOUR, label: 'Kilometers per hour (km/h)' },
            { value: PaceUnit.MILES_PER_HOUR, label: 'Miles per hour (mph)' },
          ]}
        />
      </Stack>
    </Modal>
  );
} 