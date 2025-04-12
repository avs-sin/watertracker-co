import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store';
import { addIntake } from '../store/intakeSlice';
import { DrinkType } from '../models/DrinkIntake';
import DrinkTypeButton from '../components/DrinkTypeButton';
import CustomSliderView from '../components/CustomSliderView';

const AddDrinkScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  
  // Form state
  const [amount, setAmount] = useState(250); // Default 250ml
  const [type, setType] = useState<DrinkType>('water');
  const [note, setNote] = useState('');
  
  // Presets for quick selection
  const presetAmounts = [100, 200, 250, 300, 500, 750, 1000];
  const drinkTypes: DrinkType[] = ['water', 'coffee', 'tea', 'juice', 'soda', 'milk', 'custom'];
  
  const handleAddDrink = () => {
    const newIntake = {
      id: uuidv4(),
      amount,
      type,
      timestamp: Date.now(),
      note: note.trim() || undefined
    };
    
    dispatch(addIntake(newIntake));
    
    Alert.alert(
      'Drink Added',
      `You've added ${amount} ${settings.measurementUnit} of ${type}`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }
      ]
    );
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add Drink</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Drink Type</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.drinkTypeScrollContent}
          >
            {drinkTypes.map((drinkType) => (
              <DrinkTypeButton
                key={drinkType}
                type={drinkType}
                selected={type === drinkType}
                onPress={() => setType(drinkType)}
                style={styles.drinkTypeButton}
              />
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.currentAmount}>
            <Text style={styles.amountValue}>{amount}</Text>
            <Text style={styles.amountUnit}>{settings.measurementUnit}</Text>
          </View>
          
          <View style={styles.presetsContainer}>
            {presetAmounts.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.presetButton,
                  preset === amount && styles.selectedPresetButton
                ]}
                onPress={() => setAmount(preset)}
              >
                <Text 
                  style={[
                    styles.presetText,
                    preset === amount && styles.selectedPresetText
                  ]}
                >
                  {preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.sliderContainer}>
            <CustomSliderView
              minimumValue={50}
              maximumValue={1000}
              step={10}
              value={amount}
              onValueChange={setAmount}
              thumbTintColor="#2196F3"
              minimumTrackTintColor="#2196F3"
              showValue={false}
              unit={settings.measurementUnit}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note about this drink..."
            multiline
            maxLength={200}
          />
          <Text style={styles.characterCount}>
            {note.length}/200 characters
          </Text>
        </View>
        
        <View style={styles.timeSection}>
          <Icon name="clock-outline" size={20} color="#666666" />
          <Text style={styles.timeText}>
            Added for {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddDrink}
        >
          <Icon name="plus" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Drink</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  drinkTypeScrollContent: {
    paddingBottom: 8,
  },
  drinkTypeButton: {
    marginRight: 12,
    minWidth: 100,
  },
  currentAmount: {
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
  presetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  selectedPresetButton: {
    backgroundColor: '#2196F3',
  },
  presetText: {
    color: '#333333',
  },
  selectedPresetText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sliderContainer: {
    marginTop: 16,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  characterCount: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'right',
    marginTop: 8,
  },
  timeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
  },
});

export default AddDrinkScreen;