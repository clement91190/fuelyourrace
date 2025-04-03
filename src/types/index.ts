export interface NutritionFacts {
  carbs: number; // in grams
  calories: number;
  sodium: number; // in mg
  proteins: number; // in grams
  caffeine: number; // in mg
  volume?: number; // in ml 
}

export enum FoodCategory {
  GEL = 'GEL',
  DRINK = 'DRINK',
  BAR = 'BAR',
}

export interface Brand {
  id: string;
  name: string;
  iconUrl?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  brand: Brand;
  nutritionFacts: NutritionFacts
  category: FoodCategory;
  isCustom: boolean;
  isSelected?: boolean;
  servingSize: string;
  description?: string;
}

export interface FoodLibrary {
  items: FoodItem[];
  brands: Brand[];
}

export interface AidStation {
  id: string;
  name: string;
  distanceFromStart: number; // in kilometers
  elevationFromStart: number; // in meters (cumulative gain)
  currentElevation?: number; // in meters
  estimatedTimeFromStart: string; // in HH:MM:SS format
  assistanceAllowed: boolean;
  foodItems: {
    itemId: string;
    count: number;
  }[];
  notes?: string; // Optional notes for the aid station
}

export interface RaceProfile {
  id: string;
  name: string;
  totalDistance: number; // in kilometers
  totalElevationGain: number; // in meters
  totalElevationLoss: number; // in meters
  startLocation: string;
  finishLocation: string;
  startElevation: number; // in meters
  aidStations: AidStation[];
} 

export interface RacePlan {
  id: string;
  raceProfile: RaceProfile;
  foodItems: {
    foodItem: FoodItem;
    quantity: number;
    aidStationId: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
} 