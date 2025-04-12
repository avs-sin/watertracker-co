import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format } from 'date-fns';
import { DrinkIntake, DailyIntakes } from '../models/DrinkIntake';

interface IntakeState {
  dailyIntakes: DailyIntakes;
}

const initialState: IntakeState = {
  dailyIntakes: {},
};

export const intakeSlice = createSlice({
  name: 'intake',
  initialState,
  reducers: {
    addIntake: (state, action: PayloadAction<DrinkIntake>) => {
      const intake = action.payload;
      const dateKey = format(new Date(intake.timestamp), 'yyyy-MM-dd');
      
      if (!state.dailyIntakes[dateKey]) {
        state.dailyIntakes[dateKey] = {
          date: dateKey,
          intakes: [],
          totalAmount: 0,
        };
      }
      
      state.dailyIntakes[dateKey].intakes.push(intake);
      state.dailyIntakes[dateKey].totalAmount += intake.amount;
    },
    
    updateIntake: (state, action: PayloadAction<{
      id: string;
      date: string;
      updatedIntake: Partial<DrinkIntake>;
    }>) => {
      const { id, date, updatedIntake } = action.payload;
      
      if (!state.dailyIntakes[date]) {
        return;
      }
      
      const intakeIndex = state.dailyIntakes[date].intakes.findIndex(intake => intake.id === id);
      
      if (intakeIndex === -1) {
        return;
      }
      
      // Calculate the difference in amount if it's being updated
      const oldAmount = state.dailyIntakes[date].intakes[intakeIndex].amount;
      const newAmount = updatedIntake.amount !== undefined ? updatedIntake.amount : oldAmount;
      const amountDifference = newAmount - oldAmount;
      
      // Update the specific intake
      state.dailyIntakes[date].intakes[intakeIndex] = {
        ...state.dailyIntakes[date].intakes[intakeIndex],
        ...updatedIntake,
      };
      
      // Update the total amount for the day
      state.dailyIntakes[date].totalAmount += amountDifference;
    },
    
    removeIntake: (state, action: PayloadAction<{
      id: string;
      date: string;
    }>) => {
      const { id, date } = action.payload;
      
      if (!state.dailyIntakes[date]) {
        return;
      }
      
      const intakeIndex = state.dailyIntakes[date].intakes.findIndex(intake => intake.id === id);
      
      if (intakeIndex === -1) {
        return;
      }
      
      // Subtract the amount from the total
      state.dailyIntakes[date].totalAmount -= state.dailyIntakes[date].intakes[intakeIndex].amount;
      
      // Remove the intake
      state.dailyIntakes[date].intakes.splice(intakeIndex, 1);
      
      // If no more intakes for this day, remove the day entry
      if (state.dailyIntakes[date].intakes.length === 0) {
        delete state.dailyIntakes[date];
      }
    },
    
    clearIntakes: (state) => {
      state.dailyIntakes = {};
    },
    
    setDailyIntakes: (state, action: PayloadAction<DailyIntakes>) => {
      state.dailyIntakes = action.payload;
    },
  },
});

export const {
  addIntake,
  updateIntake,
  removeIntake,
  clearIntakes,
  setDailyIntakes,
} = intakeSlice.actions;

export default intakeSlice.reducer;