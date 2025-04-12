import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import intakeReducer from './intakeSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    intake: intakeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;