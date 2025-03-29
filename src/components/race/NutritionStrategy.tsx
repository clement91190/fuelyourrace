import { Stack, Text, Group } from '@mantine/core';
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { raceProfilesStore } from '@/store/raceProfiles';
import { pantryStore } from '@/store/pantry';
import { settingsStore } from '@/store/settings';
import { NutritionControls } from '../nutrition/NutritionControls';
import { NutritionChart } from '../nutrition/NutritionChart';
import { NutritionTable } from '../nutrition/NutritionTable';
import { calculateNutritionData } from '../nutrition/calculateNutritionData';
import { ViewMode, MetricType, DisplayMode } from '../nutrition/types';
import { RacePlan } from '@/types';

export function NutritionStrategy() {
  const { profiles, selectedProfileId } = useStore(raceProfilesStore);
  const { defaultItems, userItems } = useStore(pantryStore);
  const settings = useStore(settingsStore);
  const [viewMode, setViewMode] = useState<ViewMode>('segments');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('carbs');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('rate');

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  if (!selectedProfile) return null;

  // Create a race plan with the current state
  const currentPlan: RacePlan = {
    id: selectedProfile.name, // Use race name as ID
    raceProfile: selectedProfile,
    foodItems: selectedProfile.aidStations.flatMap(station => 
      station.foodItems.map(item => {
        // First try to find in user items, then in default items
        const foodItem = userItems.find(pantryItem => pantryItem.id === item.itemId) ||
                        defaultItems.find(pantryItem => pantryItem.id === item.itemId);
        if (!foodItem) {
          console.error(`Food item ${item.itemId} not found in pantry`);
          return null;
        }
        return {
          foodItem,
          quantity: item.count,
          aidStationId: station.id
        };
      }).filter((item): item is NonNullable<typeof item> => item !== null)
    ),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const nutritionData = calculateNutritionData(selectedProfile.aidStations, [...defaultItems, ...userItems], currentPlan, viewMode);
  const metricLabel = selectedMetric === 'calories' ? 'Calories' : 
                     selectedMetric === 'carbs' ? 'Carbs (g)' : 
                     selectedMetric === 'protein' ? 'Protein (g)' :
                     selectedMetric === 'sodium' ? 'Sodium (mg)' :
                     selectedMetric === 'volume' ? `Volume (${settings.volumeUnit})` :
                     'Caffeine (mg)';
  const displayLabel = displayMode === 'rate' ? `${metricLabel}/hour` : metricLabel;

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="xl" fw={700}>Nutrition Strategy</Text>
        <NutritionControls
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          displayMode={displayMode}
          setDisplayMode={setDisplayMode}
          settings={settings}
        />
      </Group>

      <NutritionChart
        data={nutritionData}
        displayMode={displayMode}
        selectedMetric={selectedMetric}
        displayLabel={displayLabel}
        settings={settings}
      />

      <NutritionTable data={nutritionData} settings={settings} />
    </Stack>
  );
} 