import { atom } from 'nanostores';
import { FoodItem } from '../types';
import Cookies from 'js-cookie';
import { initialFoodItems } from '../data/foodItems';

const USER_PANTRY_COOKIE_KEY = 'user_pantry_items';

interface PantryStore {
  defaultItems: FoodItem[];
  userItems: FoodItem[];
}

const loadUserItemsFromCookie = (): FoodItem[] => {
  const cookieData = Cookies.get(USER_PANTRY_COOKIE_KEY);
  if (!cookieData) return [];
  
  try {
    return JSON.parse(cookieData);
  } catch (error) {
    console.error('Error loading user pantry from cookie:', error);
    return [];
  }
};

const saveUserItemsToCookie = (items: FoodItem[]) => {
  try {
    Cookies.set(USER_PANTRY_COOKIE_KEY, JSON.stringify(items), { expires: 365 }); // Expires in 1 year
  } catch (error) {
    console.error('Error saving user pantry to cookie:', error);
  }
};

export const pantryStore = atom<PantryStore>({
  defaultItems: initialFoodItems,
  userItems: loadUserItemsFromCookie()
});

// Helper to get all items (both default and user)
export const getAllItems = (): FoodItem[] => {
  const store = pantryStore.get();
  return [...store.defaultItems, ...store.userItems];
};

export const addFoodItem = (item: FoodItem) => {
  const store = pantryStore.get();
  const updatedItems = [...store.userItems, item];
  
  pantryStore.set({
    ...store,
    userItems: updatedItems
  });
  
  saveUserItemsToCookie(updatedItems);
};

export const updateFoodItem = (itemId: string, updates: Partial<FoodItem>) => {
  const store = pantryStore.get();
  
  // Check if it's a default item
  const isDefaultItem = store.defaultItems.some(item => item.id === itemId);
  if (isDefaultItem) {
    // Create a new user item based on the default one
    const defaultItem = store.defaultItems.find(item => item.id === itemId)!;
    const newUserItem: FoodItem = {
      ...defaultItem,
      ...updates,
      id: `${itemId}-custom` // Add a suffix to distinguish from default
    };
    
    const updatedItems = [...store.userItems, newUserItem];
    pantryStore.set({
      ...store,
      userItems: updatedItems
    });
    
    saveUserItemsToCookie(updatedItems);
  } else {
    // Update existing user item
    const updatedItems = store.userItems.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    pantryStore.set({
      ...store,
      userItems: updatedItems
    });
    
    saveUserItemsToCookie(updatedItems);
  }
};

export const removeFoodItem = (itemId: string) => {
  const store = pantryStore.get();
  
  // Only allow removing user items
  const updatedItems = store.userItems.filter(item => item.id !== itemId);
  
  pantryStore.set({
    ...store,
    userItems: updatedItems
  });
  
  saveUserItemsToCookie(updatedItems);
}; 