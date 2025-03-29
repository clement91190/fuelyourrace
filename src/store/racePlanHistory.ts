import { atom } from 'nanostores';
import { RacePlan } from '../types';
import Cookies from 'js-cookie';

const HISTORY_COOKIE_KEY = 'race_plan_history';
const PANTRY_COOKIE_KEY = 'pantry_items';

interface RacePlanHistoryStore {
  plans: RacePlan[];
  selectedPlanId?: string;
}

const loadHistoryFromCookie = (): RacePlan[] => {
  const cookieData = Cookies.get(HISTORY_COOKIE_KEY);
  if (!cookieData) return [];
  
  try {
    const parsedData = JSON.parse(cookieData);
    return parsedData.map((plan: any) => ({
      ...plan,
      createdAt: new Date(plan.createdAt),
      updatedAt: new Date(plan.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading race plan history:', error);
    return [];
  }
};

const saveHistoryToCookie = (plans: RacePlan[]) => {
  try {
    Cookies.set(HISTORY_COOKIE_KEY, JSON.stringify(plans), { expires: 365 }); // Expires in 1 year
  } catch (error) {
    console.error('Error saving race plan history:', error);
  }
};

export const racePlanHistoryStore = atom<RacePlanHistoryStore>({
  plans: loadHistoryFromCookie(),
  selectedPlanId: undefined
});

export const addRacePlan = (plan: RacePlan) => {
  const store = racePlanHistoryStore.get();
  const existingPlanIndex = store.plans.findIndex(p => p.raceProfile.name === plan.raceProfile.name);
  
  let updatedPlans: RacePlan[];
  if (existingPlanIndex >= 0) {
    // Update existing plan
    updatedPlans = [...store.plans];
    updatedPlans[existingPlanIndex] = plan;
  } else {
    // Add new plan
    updatedPlans = [...store.plans, plan];
  }
  
  racePlanHistoryStore.set({
    ...store,
    plans: updatedPlans,
    selectedPlanId: plan.raceProfile.name
  });
  
  saveHistoryToCookie(updatedPlans);
};

export const selectRacePlan = (planId: string) => {
  racePlanHistoryStore.set({
    ...racePlanHistoryStore.get(),
    selectedPlanId: planId
  });
};

export const removeRacePlan = (planId: string) => {
  const store = racePlanHistoryStore.get();
  const updatedPlans = store.plans.filter(plan => plan.raceProfile.name !== planId);
  
  racePlanHistoryStore.set({
    ...store,
    plans: updatedPlans,
    selectedPlanId: store.selectedPlanId === planId ? undefined : store.selectedPlanId
  });
  
  saveHistoryToCookie(updatedPlans);
}; 