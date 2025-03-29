import { AidStation, FoodItem, RacePlan } from '@/types';
import { NutritionData, ViewMode } from './types';

// Parse time strings to get hours
const parseTimeToHours = (timeStr: string) => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours + minutes / 60 + seconds / 3600;
};

export function calculateNutritionData(
  aidStations: AidStation[],
  pantryItems: FoodItem[],
  racePlan: RacePlan,
  viewMode: ViewMode
): NutritionData[] {
  const data: NutritionData[] = [];
  let cumulativeCalories = 0;
  let cumulativeCarbs = 0;
  let cumulativeProtein = 0;
  let cumulativeSodium = 0;
  let cumulativeVolume = 0;
  let cumulativeCaffeine = 0;

  aidStations.forEach((station, index) => {
    // Get food items for this station from the aid station's foodItems
    const stationFoodItems = station.foodItems.map(({ itemId, count }) => {
      const foodItem = pantryItems.find(item => item.id === itemId);
      if (!foodItem) return null;
      return { foodItem, quantity: count };
    }).filter((item): item is { foodItem: FoodItem; quantity: number } => item !== null);
    
    const stationCalories = stationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
      return sum + (foodItem.nutritionFacts.calories * quantity);
    }, 0);

    const stationCarbs = stationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
      return sum + (foodItem.nutritionFacts.carbs * quantity);
    }, 0);

    const stationProtein = stationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
      return sum + (foodItem.nutritionFacts.proteins * quantity);
    }, 0);

    const stationSodium = stationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
      return sum + (foodItem.nutritionFacts.sodium * quantity);
    }, 0);

    const stationVolume = stationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
      return sum + ((foodItem.nutritionFacts.volume || 0) * quantity);
    }, 0);

    const stationCaffeine = stationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
      return sum + ((foodItem.nutritionFacts.caffeine || 0) * quantity);
    }, 0);

    if (viewMode === 'sinceStart') {
      cumulativeCalories += stationCalories;
      cumulativeCarbs += stationCarbs;
      cumulativeProtein += stationProtein;
      cumulativeSodium += stationSodium;
      cumulativeVolume += stationVolume;
      cumulativeCaffeine += stationCaffeine;
    }

    // Calculate time in hours for rate calculation
    const timeInHours = parseTimeToHours(station.estimatedTimeFromStart);

    // For segments, calculate the time difference from previous station
    let segmentTimeInHours = 0;
    let segmentCalories = 0;
    let segmentCarbs = 0;
    let segmentProtein = 0;
    let segmentSodium = 0;
    let segmentVolume = 0;
    let segmentCaffeine = 0;

    if (viewMode === 'segments' && index > 0) {
      const prevStation = aidStations[index - 1];
      segmentTimeInHours = parseTimeToHours(station.estimatedTimeFromStart) - parseTimeToHours(prevStation.estimatedTimeFromStart);
      
      // Get food items from the previous station for rate calculations
      const prevStationFoodItems = prevStation.foodItems.map(({ itemId, count }) => {
        const foodItem = pantryItems.find(item => item.id === itemId);
        if (!foodItem) return null;
        return { foodItem, quantity: count };
      }).filter((item): item is { foodItem: FoodItem; quantity: number } => item !== null);

      segmentCalories = prevStationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
        return sum + (foodItem.nutritionFacts.calories * quantity);
      }, 0);

      segmentCarbs = prevStationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
        return sum + (foodItem.nutritionFacts.carbs * quantity);
      }, 0);

      segmentProtein = prevStationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
        return sum + (foodItem.nutritionFacts.proteins * quantity);
      }, 0);

      segmentSodium = prevStationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
        return sum + (foodItem.nutritionFacts.sodium * quantity);
      }, 0);

      segmentVolume = prevStationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
        return sum + ((foodItem.nutritionFacts.volume || 0) * quantity);
      }, 0);

      segmentCaffeine = prevStationFoodItems.reduce((sum: number, { foodItem, quantity }) => {
        return sum + ((foodItem.nutritionFacts.caffeine || 0) * quantity);
      }, 0);
    }

    // Format display name for segments
    const displayName = viewMode === 'segments' && index > 0
      ? `From ${aidStations[index - 1].name} to ${station.name}`
      : station.name;

    // Skip the first station in segments mode
    if (viewMode === 'segments' && index === 0) {
      return;
    }

    data.push({
      station: station.name,
      displayName,
      calories: viewMode === 'sinceStart' ? cumulativeCalories : stationCalories,
      carbs: viewMode === 'sinceStart' ? cumulativeCarbs : stationCarbs,
      protein: viewMode === 'sinceStart' ? cumulativeProtein : stationProtein,
      sodium: viewMode === 'sinceStart' ? cumulativeSodium : stationSodium,
      volume: viewMode === 'sinceStart' ? cumulativeVolume : stationVolume,
      caffeine: viewMode === 'sinceStart' ? cumulativeCaffeine : stationCaffeine,
      timeFromStart: station.estimatedTimeFromStart,
      caloriesPerHour: viewMode === 'sinceStart' 
        ? (timeInHours > 0 ? cumulativeCalories / timeInHours : 0)
        : (segmentTimeInHours > 0 ? segmentCalories / segmentTimeInHours : 0),
      carbsPerHour: viewMode === 'sinceStart'
        ? (timeInHours > 0 ? cumulativeCarbs / timeInHours : 0)
        : (segmentTimeInHours > 0 ? segmentCarbs / segmentTimeInHours : 0),
      proteinPerHour: viewMode === 'sinceStart'
        ? (timeInHours > 0 ? cumulativeProtein / timeInHours : 0)
        : (segmentTimeInHours > 0 ? segmentProtein / segmentTimeInHours : 0),
      sodiumPerHour: viewMode === 'sinceStart'
        ? (timeInHours > 0 ? cumulativeSodium / timeInHours : 0)
        : (segmentTimeInHours > 0 ? segmentSodium / segmentTimeInHours : 0),
      volumePerHour: viewMode === 'sinceStart'
        ? (timeInHours > 0 ? cumulativeVolume / timeInHours : 0)
        : (segmentTimeInHours > 0 ? segmentVolume / segmentTimeInHours : 0),
      caffeinePerHour: viewMode === 'sinceStart'
        ? (timeInHours > 0 ? cumulativeCaffeine / timeInHours : 0)
        : (segmentTimeInHours > 0 ? segmentCaffeine / segmentTimeInHours : 0),
    });
  });

  return data;
} 