import { Group, SegmentedControl, Select } from '@mantine/core';
import { NutritionControlsProps } from './types';
import { Settings } from '@/types/settings';

interface ExtendedNutritionControlsProps extends NutritionControlsProps {
  settings: Settings;
}

export function NutritionControls({
  viewMode,
  setViewMode,
  selectedMetric,
  setSelectedMetric,
  displayMode,
  setDisplayMode,
  settings,
}: ExtendedNutritionControlsProps) {
  return (
    <Group>
      <SegmentedControl
        value={viewMode}
        onChange={(value) => setViewMode(value as 'sinceStart' | 'segments')}
        data={[
          { label: 'Since Start', value: 'sinceStart' },
          { label: 'Segments', value: 'segments' },
        ]}
      />
      <Select
        value={selectedMetric}
        onChange={(value) => setSelectedMetric(value as 'carbs' | 'calories' | 'protein' | 'sodium' | 'volume' | 'caffeine')}
        data={[
          { value: 'carbs', label: 'Carbs (g)' },
          { value: 'calories', label: 'Calories' },
          { value: 'protein', label: 'Protein (g)' },
          { value: 'sodium', label: 'Sodium (mg)' },
          { value: 'volume', label: `Volume (${settings.volumeUnit})` },
          { value: 'caffeine', label: 'Caffeine (mg)' },
        ]}
      />
      <SegmentedControl
        value={displayMode}
        onChange={(value) => setDisplayMode(value as 'rate' | 'total')}
        data={[
          { label: 'Rate', value: 'rate' },
          { label: 'Total', value: 'total' },
        ]}
      />
    </Group>
  );
} 