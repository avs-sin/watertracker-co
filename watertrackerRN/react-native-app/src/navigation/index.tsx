import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import DrinksScreen from '../screens/DrinksScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PremiumScreen from '../screens/PremiumScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DrinkDetailScreen from '../screens/DrinkDetailScreen';
import AddDrinkScreen from '../screens/AddDrinkScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Define types
type MainTabParamList = {
  Dashboard: undefined;
  Drinks: undefined;
  History: undefined;
  Premium: undefined;
  Settings: undefined;
};

type DashboardStackParamList = {
  DashboardMain: undefined;
  DrinkDetail: { id: string; date: string };
};

type DrinksStackParamList = {
  DrinksMain: undefined;
  AddDrink: undefined;
};

type HistoryStackParamList = {
  HistoryMain: undefined;
  DrinkDetail: { id: string; date: string };
};

type SettingsStackParamList = {
  SettingsMain: undefined;
  Profile: undefined;
};

// Create navigators
const Tab = createBottomTabNavigator<MainTabParamList>();
const DashboardStack = createStackNavigator<DashboardStackParamList>();
const DrinksStack = createStackNavigator<DrinksStackParamList>();
const HistoryStack = createStackNavigator<HistoryStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

// Stack navigators for each tab
const DashboardStackNavigator = () => (
  <DashboardStack.Navigator>
    <DashboardStack.Screen 
      name="DashboardMain" 
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
    <DashboardStack.Screen 
      name="DrinkDetail" 
      component={DrinkDetailScreen}
      options={{ title: 'Drink Details' }}
    />
  </DashboardStack.Navigator>
);

const DrinksStackNavigator = () => (
  <DrinksStack.Navigator>
    <DrinksStack.Screen 
      name="DrinksMain" 
      component={DrinksScreen}
      options={{ headerShown: false }}
    />
    <DrinksStack.Screen 
      name="AddDrink" 
      component={AddDrinkScreen}
      options={{ title: 'Add Drink' }}
    />
  </DrinksStack.Navigator>
);

const HistoryStackNavigator = () => (
  <HistoryStack.Navigator>
    <HistoryStack.Screen 
      name="HistoryMain" 
      component={HistoryScreen}
      options={{ headerShown: false }}
    />
    <HistoryStack.Screen 
      name="DrinkDetail" 
      component={DrinkDetailScreen}
      options={{ title: 'Drink Details' }}
    />
  </HistoryStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen 
      name="SettingsMain" 
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
    <SettingsStack.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </SettingsStack.Navigator>
);

// Main tab navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';
            switch (route.name) {
              case 'Dashboard':
                iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
                break;
              case 'Drinks':
                iconName = focused ? 'cup-water' : 'cup-outline';
                break;
              case 'History':
                iconName = focused ? 'history' : 'history';
                break;
              case 'Premium':
                iconName = focused ? 'crown' : 'crown-outline';
                break;
              case 'Settings':
                iconName = focused ? 'cog' : 'cog-outline';
                break;
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2196F3',
          tabBarInactiveTintColor: '#666666',
          headerShown: false
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardStackNavigator} />
        <Tab.Screen name="Drinks" component={DrinksStackNavigator} />
        <Tab.Screen name="History" component={HistoryStackNavigator} />
        <Tab.Screen name="Premium" component={PremiumScreen} />
        <Tab.Screen name="Settings" component={SettingsStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;