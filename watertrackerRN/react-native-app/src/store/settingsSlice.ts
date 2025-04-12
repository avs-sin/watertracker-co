import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSettings } from '../models/DrinkIntake';

const initialState: UserSettings = {
  dailyGoal: 2500, // Default 2500ml (2.5L)
  reminderEnabled: false,
  reminderInterval: 60, // Default 60 minutes
  measurementUnit: 'ml',
  avatarId: 1,
  username: 'User',
  premiumUser: false
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload;
    },
    
    updateReminderSettings: (state, action: PayloadAction<{ enabled?: boolean; interval?: number }>) => {
      if (action.payload.enabled !== undefined) {
        state.reminderEnabled = action.payload.enabled;
      }
      if (action.payload.interval !== undefined) {
        state.reminderInterval = action.payload.interval;
      }
    },
    
    updateMeasurementUnit: (state, action: PayloadAction<'ml' | 'oz'>) => {
      state.measurementUnit = action.payload;
    },
    
    updateAvatar: (state, action: PayloadAction<number>) => {
      state.avatarId = action.payload;
    },
    
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    
    setPremiumStatus: (state, action: PayloadAction<boolean>) => {
      state.premiumUser = action.payload;
    },
    
    setNotificationTimes: (
      state, 
      action: PayloadAction<{ hour: number; minute: number }[]>
    ) => {
      state.notificationTime = action.payload;
    },
    
    setSettings: (state, action: PayloadAction<UserSettings>) => {
      return action.payload;
    }
  }
});

export const {
  updateDailyGoal,
  updateReminderSettings,
  updateMeasurementUnit,
  updateAvatar,
  updateUsername,
  setPremiumStatus,
  setNotificationTimes,
  setSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;