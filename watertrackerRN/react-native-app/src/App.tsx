import React, { useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';
import AppNavigator from './navigation';
import { loadDailyIntakes, loadUserSettings } from './utils/storage';
import { setDailyIntakes } from './store/intakeSlice';
import { loadSettings } from './store/settingsSlice';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    // Load saved data when app starts
    const loadStoredData = async () => {
      try {
        // Load daily intake data
        const dailyIntakes = await loadDailyIntakes();
        store.dispatch(setDailyIntakes(dailyIntakes));
        
        // Load user settings
        const settings = await loadUserSettings();
        if (settings) {
          store.dispatch(loadSettings(settings));
        }
        
        // Hide splash screen after data is loaded
        SplashScreen.hide();
      } catch (error) {
        console.error('Error loading stored data:', error);
        SplashScreen.hide();
      }
    };
    
    loadStoredData();
  }, []);

  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={{ flex: 1 }}>
        <AppNavigator />
      </SafeAreaView>
    </Provider>
  );
};

export default App;