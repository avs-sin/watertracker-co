export type DrinkType = 'water' | 'coffee' | 'tea' | 'juice' | 'soda' | 'milk' | 'custom';

export interface DrinkIntake {
  id: string;
  amount: number; // in ml
  type: DrinkType;
  timestamp: number; // Unix timestamp
  note?: string;
}

export interface UserSettings {
  dailyGoal: number; // Daily water intake goal in ml
  reminderEnabled: boolean;
  reminderInterval: number; // in minutes
  measurementUnit: 'ml' | 'oz';
  avatarId: number;
  username: string;
  premiumUser: boolean;
  notificationTime?: {
    hour: number;
    minute: number;
  }[];
}

export interface DailyIntakes {
  [date: string]: {
    date: string;
    intakes: DrinkIntake[];
    totalAmount: number;
  };
}