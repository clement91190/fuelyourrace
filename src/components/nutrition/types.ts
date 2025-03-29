export interface NutritionData {
  station: string;
  displayName: string;
  calories: number;
  carbs: number;
  protein: number;
  sodium: number;
  volume: number;
  caffeine: number;
  timeFromStart: string;
  caloriesPerHour: number;
  carbsPerHour: number;
  proteinPerHour: number;
  sodiumPerHour: number;
  volumePerHour: number;
  caffeinePerHour: number;
}

export type ViewMode = 'sinceStart' | 'segments';
export type MetricType = 'carbs' | 'calories' | 'protein' | 'sodium' | 'volume' | 'caffeine';
export type DisplayMode = 'rate' | 'total';

export interface NutritionControlsProps {
  viewMode: ViewMode;
  setViewMode: (_mode: ViewMode) => void;
  selectedMetric: MetricType;
  setSelectedMetric: (_metric: MetricType) => void;
  displayMode: DisplayMode;
  setDisplayMode: (_mode: DisplayMode) => void;
} 