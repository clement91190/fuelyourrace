import { atom } from 'nanostores';
import { FoodItem, FoodLibrary } from '@/types';
import Cookies from 'js-cookie';

const USER_PANTRY_COOKIE_KEY = 'user_pantry_items';

interface FoodLibraryState {
  library: FoodLibrary;
  selectedItems: FoodItem[];
  customItems: FoodItem[];
}

const loadCustomItemsFromCookie = (): FoodItem[] => {
  const cookieData = Cookies.get(USER_PANTRY_COOKIE_KEY);
  if (!cookieData) return [];
  
  try {
    return JSON.parse(cookieData);
  } catch (error) {
    console.error('Error loading custom items from cookie:', error);
    return [];
  }
};

const saveCustomItemsToCookie = (items: FoodItem[]) => {
  try {
    Cookies.set(USER_PANTRY_COOKIE_KEY, JSON.stringify(items), { expires: 365 });
  } catch (error) {
    console.error('Error saving custom items to cookie:', error);
  }
};

export const foodLibraryStore = atom<FoodLibraryState>({
  library: { items: [], brands: [] },
  selectedItems: [],
  customItems: loadCustomItemsFromCookie()
});

export function setFoodLibrary(library: FoodLibrary) {
  const currentState = foodLibraryStore.get();
  foodLibraryStore.set({
    ...currentState,
    library
  });
}

export function toggleItemSelection(item: FoodItem) {
  const currentState = foodLibraryStore.get();
  const isSelected = currentState.selectedItems.some(i => i.id === item.id);
  
  if (isSelected) {
    foodLibraryStore.set({
      ...currentState,
      selectedItems: currentState.selectedItems.filter(i => i.id !== item.id)
    });
  } else {
    foodLibraryStore.set({
      ...currentState,
      selectedItems: [...currentState.selectedItems, item]
    });
  }
}

export function addCustomItem(item: FoodItem) {
  const currentState = foodLibraryStore.get();
  const updatedCustomItems = [...currentState.customItems, item];
  
  foodLibraryStore.set({
    ...currentState,
    customItems: updatedCustomItems
  });
  
  saveCustomItemsToCookie(updatedCustomItems);
}

export function removeCustomItem(itemId: string) {
  const currentState = foodLibraryStore.get();
  const updatedCustomItems = currentState.customItems.filter(item => item.id !== itemId);
  
  foodLibraryStore.set({
    ...currentState,
    customItems: updatedCustomItems
  });
  
  saveCustomItemsToCookie(updatedCustomItems);
}

export function updateCustomItem(itemId: string, updates: Partial<FoodItem>) {
  const currentState = foodLibraryStore.get();
  const updatedCustomItems = currentState.customItems.map(item => 
    item.id === itemId ? { ...item, ...updates } : item
  );
  
  foodLibraryStore.set({
    ...currentState,
    customItems: updatedCustomItems
  });
  
  saveCustomItemsToCookie(updatedCustomItems);
}

// Helper to get all available items (library + custom)
export function getAllAvailableItems(): FoodItem[] {
  const state = foodLibraryStore.get();
  return [...state.library.items, ...state.customItems];
}

// Helper to get all selected items
export function getSelectedItems(): FoodItem[] {
  return foodLibraryStore.get().selectedItems;
}

// Helper to get all custom items
export function getCustomItems(): FoodItem[] {
  return foodLibraryStore.get().customItems;
} 