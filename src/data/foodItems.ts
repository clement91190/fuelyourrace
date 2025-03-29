import { FoodItem, FoodCategory } from '../types';

export const initialFoodItems: FoodItem[] = [
  {
    id: 'maurten-gel-100',
    name: 'Maurten Gel 100',
    category: FoodCategory.GEL,
    nutritionFacts: {
      calories: 100,
      carbs: 25,
      proteins: 0,
      sodium: 0,
      caffeine: 0
    },
    servingSize: '40g',
    description: 'High-carb energy gel with hydrogel technology'
  },
  {
    id: 'maurten-gel-100-caf',
    name: 'Maurten Gel 100 Caffeine',
    category: FoodCategory.GEL,
    nutritionFacts: {
      calories: 100,
      carbs: 25,
      proteins: 0,
      sodium: 0,
      caffeine: 100
    },
    servingSize: '40g',
    description: 'High-carb energy gel with hydrogel technology and 100mg caffeine'
  },
  {
    id: 'maurten-gel-160',
    name: 'Maurten Gel 160',
    category: FoodCategory.GEL,
    nutritionFacts: {
      calories: 160,
      carbs: 40,
      proteins: 0,
      sodium: 0,
      caffeine: 0
    },
    servingSize: '40g',
    description: 'High-carb energy gel with hydrogel technology'
  },
  {
    id: 'maurten-drink-320',
    name: 'Maurten Drink Mix 320',
    category: FoodCategory.DRINK,
    nutritionFacts: {
      calories: 320,
      carbs: 80,
      proteins: 0,
      sodium: 0,
      caffeine: 0,
      volume: 500
    },
    servingSize: '500ml',
    description: 'High-carb drink mix with hydrogel technology'
  },
  {
    id: 'maurten-drink-160',
    name: 'Maurten Drink Mix 160',
    category: FoodCategory.DRINK,
    nutritionFacts: {
      calories: 160,
      carbs: 40,
      proteins: 0,
      sodium: 0,
      caffeine: 0,
      volume: 500
    },
    servingSize: '500ml',
    description: 'High-carb drink mix with hydrogel technology'
  }
]; 