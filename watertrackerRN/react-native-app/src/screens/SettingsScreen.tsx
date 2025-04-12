import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store';
import {
  updateDailyGoal,
  updateMeasurementUnit,
  updateReminderSettings,
} from '../store/settingsSlice';
import { saveUserSettings } from '../utils/storage';
import CustomSliderView from '../components/CustomSliderView';

const SettingsScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  
  const [dailyGoal, setDailyGoal] = useState(settings.dailyGoal);
  const [reminderEnabled, setReminderEnabled] = useState(settings.reminderEnabled);
  const [reminderInterval, setReminderInterval] = useState(settings.reminderInterval);
  const [measurementUnit, setMeasurementUnit] = useState(settings.measurementUnit);
  
  const handleSaveSettings = async () => {
    // Update Redux state
    dispatch(updateDailyGoal(dailyGoal));
    dispatch(updateMeasurementUnit(measurementUnit));
    dispatch(updateReminderSettings({
      enabled: reminderEnabled,
      interval: reminderInterval
    }));
    
    // Save to AsyncStorage
    try {
      await saveUserSettings({
        ...settings,
        dailyGoal,
        measurementUnit,
        reminderEnabled,
        reminderInterval
      });
      
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
      console.error('Error saving settings:', error);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Water Goal</Text>
        <Text style={styles.sectionDescription}>
          Set your daily water intake target
        </Text>
        
        <View style={styles.goalValueContainer}>
          <Text style={styles.goalValue}>{dailyGoal}</Text>
          <Text style={styles.goalUnit}>{measurementUnit}</Text>
        </View>
        
        <CustomSliderView
          minimumValue={1000}
          maximumValue={5000}
          step={100}
          value={dailyGoal}
          onValueChange={setDailyGoal}
          thumbTintColor="#2196F3"
          minimumTrackTintColor="#2196F3"
          unit={` ${measurementUnit}`}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Measurement Units</Text>
        <Text style={styles.sectionDescription}>
          Choose your preferred unit of measurement
        </Text>
        
        <View style={styles.unitSelector}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              measurementUnit === 'ml' && styles.unitButtonActive
            ]}
            onPress={() => setMeasurementUnit('ml')}
          >
            <Text
              style={[
                styles.unitButtonText,
                measurementUnit === 'ml' && styles.unitButtonTextActive
              ]}
            >
              Milliliters (ml)
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.unitButton,
              measurementUnit === 'oz' && styles.unitButtonActive
            ]}
            onPress={() => setMeasurementUnit('oz')}
          >
            <Text
              style={[
                styles.unitButtonText,
                measurementUnit === 'oz' && styles.unitButtonTextActive
              ]}
            >
              Fluid Ounces (oz)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reminders</Text>
        <Text style={styles.sectionDescription}>
          Get notifications to help you stay hydrated
        </Text>
        
        <View style={styles.reminderToggle}>
          <Text style={styles.reminderToggleText}>Enable Reminders</Text>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: '#E0E0E0', true: '#E3F2FD' }}
            thumbColor={reminderEnabled ? '#2196F3' : '#F5F5F5'}
            ios_backgroundColor="#E0E0E0"
          />
        </View>
        
        {reminderEnabled && (
          <View style={styles.intervalSelector}>
            <Text style={styles.intervalLabel}>Reminder Frequency</Text>
            
            <View style={styles.intervalButtonsContainer}>
              {[30, 60, 90, 120, 180, 240].map((interval) => (
                <TouchableOpacity
                  key={interval}
                  style={[
                    styles.intervalButton,
                    reminderInterval === interval && styles.intervalButtonActive
                  ]}
                  onPress={() => setReminderInterval(interval)}
                >
                  <Text
                    style={[
                      styles.intervalButtonText,
                      reminderInterval === interval && styles.intervalButtonTextActive
                    ]}
                  >
                    {interval < 60 ? `${interval}m` : `${interval / 60}h`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon name="account" size={24} color="#2196F3" style={styles.profileButtonIcon} />
        <Text style={styles.profileButtonText}>Edit Profile</Text>
        <Icon name="chevron-right" size={24} color="#CCCCCC" />
      </TouchableOpacity>
      
      {!settings.premiumUser && (
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => navigation.navigate('Premium')}
        >
          <Icon name="crown" size={24} color="#FFD700" style={styles.upgradeButtonIcon} />
          <View style={styles.upgradeTextContainer}>
            <Text style={styles.upgradeTitle}>Upgrade to Premium</Text>
            <Text style={styles.upgradeDescription}>
              Get more features and remove ads
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#CCCCCC" />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>WaterTracker v1.0</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  goalValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  goalValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2196F3',
  },
  goalUnit: {
    fontSize: 18,
    color: '#666666',
    marginLeft: 4,
  },
  unitSelector: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  unitButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  unitButtonActive: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  unitButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666666',
  },
  unitButtonTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  reminderToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reminderToggleText: {
    fontSize: 16,
  },
  intervalSelector: {
    marginTop: 8,
  },
  intervalLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  intervalButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  intervalButton: {
    width: '30%',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  intervalButtonActive: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  intervalButtonText: {
    color: '#666666',
  },
  intervalButtonTextActive: {
    color: '#2196F3',
    fontWeight: '600',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  profileButtonIcon: {
    marginRight: 12,
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  upgradeButtonIcon: {
    marginRight: 12,
  },
  upgradeTextContainer: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 12,
  },
  footerLink: {
    fontSize: 14,
    color: '#2196F3',
    marginTop: 8,
  },
});

export default SettingsScreen;