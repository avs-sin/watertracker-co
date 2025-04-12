import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../store';
import { addIntake } from '../store/intakeSlice';
import { saveDailyIntakes } from '../utils/storage';
import DrinkTypeButton from '../components/DrinkTypeButton';
import CustomSliderView from '../components/CustomSliderView';
import { DrinkType } from '../models/DrinkIntake';

const defaultAmounts = {
  water: 250,
  coffee: 150,
  tea: 200,
  juice: 200,
  soda: 330,
  milk: 200,
  custom: 100,
};

const DrinksScreen: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const dailyIntakes = useSelector((state: RootState) => state.intake.dailyIntakes);
  
  const [selectedType, setSelectedType] = useState<DrinkType>('water');
  const [amount, setAmount] = useState(defaultAmounts.water);
  const [note, setNote] = useState('');
  
  const handleTypeSelect = (type: DrinkType) => {
    setSelectedType(type);
    setAmount(defaultAmounts[type]);
  };
  
  const handleAddIntake = async () => {
    const newIntake = {
      id: uuidv4(),
      amount,
      type: selectedType,
      timestamp: Date.now(),
      note: note.trim() || undefined
    };
    
    dispatch(addIntake(newIntake));
    
    try {
      // Get the updated state after dispatch
      const updatedIntakes = {
        ...dailyIntakes,
        // Add logic to update or create today's entry
        // This will be handled by the reducer in real implementation
      };
      
      await saveDailyIntakes(updatedIntakes);
      
      // Reset form
      setNote('');
      Alert.alert('Success', 'Drink added successfully!');
    } catch (error) {
      console.error('Error saving intake:', error);
      Alert.alert('Error', 'Failed to save drink intake');
    }
  };
  
  // Quick add amounts
  const quickAddAmounts = [50, 100, 150, 200, 250, 300, 350, 400];
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Drink</Text>
      
      <View style={styles.drinkTypeContainer}>
        <Text style={styles.sectionTitle}>Drink Type</Text>
        
        <View style={styles.drinkTypeButtonsRow}>
          <DrinkTypeButton
            type="water"
            selected={selectedType === 'water'}
            onPress={() => handleTypeSelect('water')}
            style={styles.drinkTypeButton}
          />
          <DrinkTypeButton
            type="coffee"
            selected={selectedType === 'coffee'}
            onPress={() => handleTypeSelect('coffee')}
            style={styles.drinkTypeButton}
          />
          <DrinkTypeButton
            type="tea"
            selected={selectedType === 'tea'}
            onPress={() => handleTypeSelect('tea')}
            style={styles.drinkTypeButton}
          />
        </View>
        
        <View style={styles.drinkTypeButtonsRow}>
          <DrinkTypeButton
            type="juice"
            selected={selectedType === 'juice'}
            onPress={() => handleTypeSelect('juice')}
            style={styles.drinkTypeButton}
          />
          <DrinkTypeButton
            type="soda"
            selected={selectedType === 'soda'}
            onPress={() => handleTypeSelect('soda')}
            style={styles.drinkTypeButton}
          />
          <DrinkTypeButton
            type="milk"
            selected={selectedType === 'milk'}
            onPress={() => handleTypeSelect('milk')}
            style={styles.drinkTypeButton}
          />
        </View>
        
        <View style={styles.drinkTypeButtonsRow}>
          <DrinkTypeButton
            type="custom"
            selected={selectedType === 'custom'}
            onPress={() => handleTypeSelect('custom')}
            style={[styles.drinkTypeButton, { flex: 1, marginHorizontal: 0 }]}
          />
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.sectionTitle}>Amount</Text>
        
        <View style={styles.amountValueContainer}>
          <Text style={styles.amountValue}>{amount}</Text>
          <Text style={styles.amountUnit}>{settings.measurementUnit}</Text>
        </View>
        
        <CustomSliderView
          minimumValue={10}
          maximumValue={1000}
          step={10}
          value={amount}
          onValueChange={setAmount}
          unit={` ${settings.measurementUnit}`}
        />
        
        <Text style={styles.quickAddTitle}>Quick Add</Text>
        
        <View style={styles.quickAddButtonContainer}>
          {quickAddAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickAddButton}
              onPress={() => setAmount(quickAmount)}
            >
              <Text style={styles.quickAddButtonText}>
                {quickAmount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.noteContainer}>
        <Text style={styles.sectionTitle}>Note (Optional)</Text>
        
        <TextInput
          style={styles.noteInput}
          value={note}
          onChangeText={setNote}
          placeholder="Add a note about this drink..."
          placeholderTextColor="#AAAAAA"
          multiline
          maxLength={100}
        />
      </View>
      
      <TouchableOpacity style={styles.addButton} onPress={handleAddIntake}>
        <Icon name="plus" size={24} color="#FFFFFF" style={styles.addButtonIcon} />
        <Text style={styles.addButtonText}>Add Drink</Text>
      </TouchableOpacity>
      
      <View style={styles.recentIntakesContainer}>
        <Text style={styles.sectionTitle}>Recent Intakes</Text>
        
        <RecentIntakes />
      </View>
    </ScrollView>
  );
};

// Recent intakes component to show recent drink logs
const RecentIntakes: React.FC = () => {
  const dailyIntakes = useSelector((state: RootState) => state.intake.dailyIntakes);
  const settings = useSelector((state: RootState) => state.settings);
  
  // Get today's date in format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's intakes
  const todayIntakes = dailyIntakes[today]?.intakes || [];
  
  // Take last 5 intakes
  const recentIntakes = todayIntakes
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);
  
  if (recentIntakes.length === 0) {
    return (
      <View style={styles.emptyIntakes}>
        <Icon name="water-off" size={36} color="#DDDDDD" />
        <Text style={styles.emptyIntakesText}>No drinks recorded today</Text>
        <Text style={styles.emptyIntakesSubText}>
          Add your first drink to start tracking your hydration
        </Text>
      </View>
    );
  }
  
  const getIconForType = (drinkType: DrinkType): string => {
    switch (drinkType) {
      case 'water': return 'water';
      case 'coffee': return 'coffee';
      case 'tea': return 'tea';
      case 'juice': return 'fruit-citrus';
      case 'soda': return 'bottle-soda';
      case 'milk': return 'cup';
      default: return 'cup-water';
    }
  };

  const getColorForType = (drinkType: DrinkType): string => {
    switch (drinkType) {
      case 'water': return '#2196F3';
      case 'coffee': return '#795548';
      case 'tea': return '#FF9800';
      case 'juice': return '#FF5722';
      case 'soda': return '#F44336';
      case 'milk': return '#9E9E9E';
      default: return '#9C27B0';
    }
  };
  
  // Format time from timestamp
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };
  
  return (
    <View>
      {recentIntakes.map((intake) => (
        <View key={intake.id} style={styles.recentIntakeItem}>
          <View style={[
            styles.intakeIconContainer,
            { backgroundColor: getColorForType(intake.type) }
          ]}>
            <Icon
              name={getIconForType(intake.type)}
              size={20}
              color="#FFFFFF"
            />
          </View>
          
          <View style={styles.intakeDetails}>
            <Text style={styles.intakeType}>
              {intake.type.charAt(0).toUpperCase() + intake.type.slice(1)}
            </Text>
            {intake.note && (
              <Text style={styles.intakeNote} numberOfLines={1}>
                {intake.note}
              </Text>
            )}
          </View>
          
          <View style={styles.intakeMetadata}>
            <Text style={styles.intakeAmount}>
              {intake.amount} {settings.measurementUnit}
            </Text>
            <Text style={styles.intakeTime}>
              {formatTime(intake.timestamp)}
            </Text>
          </View>
        </View>
      ))}
    </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  drinkTypeContainer: {
    marginBottom: 24,
  },
  drinkTypeButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  drinkTypeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  amountContainer: {
    marginBottom: 24,
  },
  amountValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2196F3',
  },
  amountUnit: {
    fontSize: 18,
    color: '#666666',
    marginLeft: 4,
  },
  quickAddTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  quickAddButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  quickAddButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  quickAddButtonText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  noteContainer: {
    marginBottom: 24,
  },
  noteInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  addButtonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  recentIntakesContainer: {
    marginBottom: 20,
  },
  emptyIntakes: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  emptyIntakesText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  emptyIntakesSubText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  recentIntakeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  intakeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  intakeDetails: {
    flex: 1,
  },
  intakeType: {
    fontSize: 16,
    fontWeight: '500',
  },
  intakeNote: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  intakeMetadata: {
    alignItems: 'flex-end',
  },
  intakeAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  intakeTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
});

export default DrinksScreen;