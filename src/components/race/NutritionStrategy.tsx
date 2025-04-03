import { Stack, Text, Group } from '@mantine/core';
import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { raceProfilesStore } from '@/store/raceProfiles';
import { foodLibraryStore } from '@/store/foodLibrary';
import { settingsStore } from '@/store/settings';
import { NutritionControls } from '../nutrition/NutritionControls';
import { NutritionChart } from '../nutrition/NutritionChart';
import { NutritionTable } from '../nutrition/NutritionTable';
import { RaceAverageStats } from '../nutrition/RaceAverageStats';
import { calculateNutritionData } from '../nutrition/calculateNutritionData';
import { ViewMode, MetricType, DisplayMode } from '../nutrition/types';
import { RacePlan } from '@/types';

export function NutritionStrategy() {
  const { profiles, selectedProfileId } = useStore(raceProfilesStore);
  const { library, customItems } = useStore(foodLibraryStore);
  const settings = useStore(settingsStore);
  const [viewMode, setViewMode] = useState<ViewMode>('segments');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('carbs');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('rate');

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  if (!selectedProfile) return null;

  const getAllItems = () => [...library.items, ...customItems];

  // Create a race plan with the current state
  const currentPlan: RacePlan = {
    id: selectedProfile.name, // Use race name as ID
    raceProfile: selectedProfile,
    foodItems: selectedProfile.aidStations.flatMap(station => 
      station.foodItems.map(item => {
        const foodItem = getAllItems().find(pantryItem => pantryItem.id === item.itemId);
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

  const nutritionData = calculateNutritionData(selectedProfile.aidStations, getAllItems(), currentPlan, viewMode);
  const metricLabel = selectedMetric === 'calories' ? 'Calories' : 
                     selectedMetric === 'carbs' ? 'Carbs (g)' : 
                     selectedMetric === 'protein' ? 'Protein (g)' :
                     selectedMetric === 'sodium' ? 'Sodium (mg)' :
                     selectedMetric === 'volume' ? `Volume (${settings.volumeUnit})` :
                     'Caffeine (mg)';
  const displayLabel = displayMode === 'rate' ? `${metricLabel}/hour` : metricLabel;

  // Calculate race averages
  const raceAverages = {
    carbs: nutritionData.reduce((acc, curr) => acc + curr.carbsPerHour, 0) / nutritionData.length,
    calories: nutritionData.reduce((acc, curr) => acc + curr.caloriesPerHour, 0) / nutritionData.length,
    sodium: nutritionData.reduce((acc, curr) => acc + curr.sodiumPerHour, 0) / nutritionData.length,
    protein: nutritionData.reduce((acc, curr) => acc + curr.proteinPerHour, 0) / nutritionData.length,
    volume: nutritionData.reduce((acc, curr) => acc + curr.volumePerHour, 0) / nutritionData.length,
    caffeine: nutritionData.reduce((acc, curr) => acc + curr.caffeinePerHour, 0) / nutritionData.length,
  };

  return (
    <Stack gap="md">

      <Text size="xl" fw={700}>Nutrition Strategy</Text>

      <NutritionChart
        data={nutritionData}
        displayMode={displayMode}
        selectedMetric={selectedMetric}
        displayLabel={displayLabel}
        settings={settings}
      />

      <NutritionTable data={nutritionData} settings={settings} />

      <Group justify="space-between">
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

      <RaceAverageStats data={raceAverages} />
    </Stack>
  );
} 