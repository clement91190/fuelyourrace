import { atom } from 'nanostores';
import { RaceProfile, AidStation } from '../types';
import { utmbProfile } from '../data/raceProfiles';
import { sortAndUpdateStations, updateStationTimes } from '../utils/raceCalculations';
import Cookies from 'js-cookie';
import { addRacePlan } from './racePlanHistory';
import { foodLibraryStore } from './foodLibrary';

const RACE_PROFILES_COOKIE_KEY = 'race_profiles';

interface RaceProfilesStore {
  profiles: RaceProfile[];
  selectedProfileId?: string;
}

const createRacePlan = (profile: RaceProfile) => {
  const { library, customItems } = foodLibraryStore.get();
  const allFoodItems = [...library.items, ...customItems];
  
  return {
    id: profile.name,
    raceProfile: profile,
    foodItems: profile.aidStations.flatMap(station => 
      station.foodItems.map(item => {
        const foodItem = allFoodItems.find(fi => fi.id === item.itemId);
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
};

const loadProfilesFromCookie = (): RaceProfile[] => {
  const cookieData = Cookies.get(RACE_PROFILES_COOKIE_KEY);
  if (!cookieData) return [utmbProfile];
  
  try {
    const profiles = JSON.parse(cookieData);
    // Create a race plan for the most recent profile
    if (profiles.length > 0) {
      const mostRecentProfile = profiles[profiles.length - 1];
      addRacePlan(createRacePlan(mostRecentProfile));
    }
    return profiles;
  } catch (error) {
    console.error('Error loading race profiles from cookie:', error);
    return [utmbProfile];
  }
};

const saveProfilesToCookie = (profiles: RaceProfile[]) => {
  try {
    Cookies.set(RACE_PROFILES_COOKIE_KEY, JSON.stringify(profiles), { expires: 365 }); // Expires in 1 year
  } catch (error) {
    console.error('Error saving race profiles to cookie:', error);
  }
};

export const raceProfilesStore = atom<RaceProfilesStore>({
  profiles: loadProfilesFromCookie(),
  selectedProfileId: utmbProfile.id
});

export const saveProfiles = () => {
  const store = raceProfilesStore.get();
  const selectedProfile = store.profiles.find(p => p.id === store.selectedProfileId);
  
  if (selectedProfile) {
    // Add to history
    addRacePlan(createRacePlan(selectedProfile));
    
    // Save to cookie
    saveProfilesToCookie(store.profiles);
  }
};

export const updateProfile = (profileId: string, updates: Partial<RaceProfile>) => {
  const store = raceProfilesStore.get();
  const profiles = store.profiles.map(profile => 
    profile.id === profileId ? { ...profile, ...updates } : profile
  );
  raceProfilesStore.set({ ...store, profiles });
};

export const addRaceProfile = (profile: RaceProfile) => {
  raceProfilesStore.set({
    ...raceProfilesStore.get(),
    profiles: [...raceProfilesStore.get().profiles, profile]
  });
};

export const updateAidStation = (profileId: string, aidStationId: string, updates: Partial<AidStation>) => {
  const store = raceProfilesStore.get();
  const profiles = store.profiles.map(profile => {
    if (profile.id !== profileId) return profile;
    
    let updatedStations = profile.aidStations.map(station => 
      station.id === aidStationId ? { ...station, ...updates } : station
    );

    // If time was updated, recalculate subsequent stations
    if (updates.estimatedTimeFromStart) {
      updatedStations = updateStationTimes(updatedStations, aidStationId, updates.estimatedTimeFromStart);
    }

    // Always sort by distance
    updatedStations = sortAndUpdateStations(updatedStations);

    return {
      ...profile,
      aidStations: updatedStations
    };
  });
  
  raceProfilesStore.set({ ...store, profiles });
};

export const addAidStation = (profileId: string, aidStation: AidStation) => {
  const store = raceProfilesStore.get();
  const profiles = store.profiles.map(profile => {
    if (profile.id !== profileId) return profile;
    
    return {
      ...profile,
      aidStations: sortAndUpdateStations([...profile.aidStations, aidStation])
    };
  });
  
  raceProfilesStore.set({ ...store, profiles });
};

export const removeAidStation = (profileId: string, aidStationId: string) => {
  const store = raceProfilesStore.get();
  const profiles = store.profiles.map(profile => {
    if (profile.id !== profileId) return profile;
    
    return {
      ...profile,
      aidStations: profile.aidStations.filter(station => station.id !== aidStationId)
    };
  });
  
  raceProfilesStore.set({ ...store, profiles });
};

export const createNewProfile = () => {
  const store = raceProfilesStore.get();
  const defaultProfile = { ...utmbProfile };
  const newProfile = {
    ...defaultProfile,
    id: `new-race-${Date.now()}`,
    name: 'New Race'
  };
  
  // Add the new profile and select it
  raceProfilesStore.set({
    ...store,
    profiles: [...store.profiles, newProfile],
    selectedProfileId: newProfile.id
  });
  
  // Save to cookie
  saveProfilesToCookie([...store.profiles, newProfile]);
};

export const resetToDefault = () => {
  const store = raceProfilesStore.get();
  const defaultProfile = { ...utmbProfile };
  
  // Update the current profile with the default one
  const profiles = store.profiles.map(profile => 
    profile.id === store.selectedProfileId ? defaultProfile : profile
  );
  
  raceProfilesStore.set({
    ...store,
    profiles
  });
  
  // Save to cookie
  saveProfilesToCookie(profiles);
}; 