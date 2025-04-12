import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyIntakes, UserSettings } from '../models/DrinkIntake';

// Storage keys
const DAILY_INTAKES_KEY = 'water_tracker_daily_intakes';
const USER_SETTINGS_KEY = 'water_tracker_user_settings';

// Storage for drink intakes
export const saveDailyIntakes = async (dailyIntakes: DailyIntakes): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(dailyIntakes);
    await AsyncStorage.setItem(DAILY_INTAKES_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving daily intakes:', error);
    throw error;
  }
};

export const loadDailyIntakes = async (): Promise<DailyIntakes | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(DAILY_INTAKES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading daily intakes:', error);
    throw error;
  }
};

// Storage for user settings
export const saveUserSettings = async (settings: UserSettings): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(USER_SETTINGS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

export const loadUserSettings = async (): Promise<UserSettings | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_SETTINGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading user settings:', error);
    throw error;
  }
};

// Clear all stored data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([DAILY_INTAKES_KEY, USER_SETTINGS_KEY]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};