import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { RootState } from '../store';
import { updateIntake, removeIntake } from '../store/intakeSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomSliderView from '../components/CustomSliderView';
import DrinkTypeButton from '../components/DrinkTypeButton';
import { DrinkType } from '../models/DrinkIntake';

const DrinkDetailScreen: React.FC = ({ route, navigation }: any) => {
  const { id, date } = route.params;
  const dispatch = useDispatch();
  const dailyIntakes = useSelector((state: RootState) => state.intake.dailyIntakes);
  const settings = useSelector((state: RootState) => state.settings);
  
  const [drinkData, setDrinkData] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<DrinkType>('water');
  const [note, setNote] = useState('');
  
  const drinkTypes: DrinkType[] = ['water', 'coffee', 'tea', 'juice', 'soda', 'milk', 'custom'];
  
  useEffect(() => {
    // Find the drink data from state
    if (dailyIntakes[date]) {
      const drink = dailyIntakes[date].intakes.find(item => item.id === id);
      if (drink) {
        setDrinkData(drink);
        setAmount(drink.amount);
        setType(drink.type as DrinkType);
        setNote(drink.note || '');
      } else {
        Alert.alert('Error', 'Drink not found');
        navigation.goBack();
      }
    } else {
      Alert.alert('Error', 'Day record not found');
      navigation.goBack();
    }
  }, [id, date, dailyIntakes]);
  
  const handleSave = () => {
    const updatedDrink = {
      amount,
      type,
      note: note.trim() || undefined
    };
    
    dispatch(updateIntake({ 
      id, 
      date, 
      updatedIntake: updatedDrink 
    }));
    
    setEditMode(false);
    Alert.alert('Success', 'Drink updated successfully');
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Drink',
      'Are you sure you want to delete this drink record?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            dispatch(removeIntake({ id, date }));
            navigation.goBack();
          } 
        }
      ]
    );
  };
  
  if (!drinkData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const getIconForDrinkType = (drinkType: DrinkType): string => {
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
  
  const getColorForDrinkType = (drinkType: DrinkType): string => {
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
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon 
            name={getIconForDrinkType(drinkData.type)} 
            size={32} 
            color={getColorForDrinkType(drinkData.type)} 
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.dateText}>
            {format(new Date(drinkData.timestamp), 'EEEE, MMMM d, yyyy')}
          </Text>
          <Text style={styles.timeText}>
            {format(new Date(drinkData.timestamp), 'h:mm a')}
          </Text>
        </View>
      </View>
      
      {!editMode ? (
        <>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Drink Type</Text>
              <Text style={styles.detailValue}>
                {drinkData.type.charAt(0).toUpperCase() + drinkData.type.slice(1)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount</Text>
              <Text style={styles.detailValue}>
                {drinkData.amount} {settings.measurementUnit}
              </Text>
            </View>
            
            {drinkData.note && (
              <View style={styles.noteContainer}>
                <Text style={styles.detailLabel}>Note</Text>
                <Text style={styles.noteText}>{drinkData.note}</Text>
              </View>
            )}
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditMode(true)}
              >
                <Icon name="pencil" size={18} color="#2196F3" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Icon name="delete" size={18} color="#F44336" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.editCard}>
            <Text style={styles.sectionTitle}>Drink Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.drinkTypesScroll}>
              <View style={styles.drinkTypesContainer}>
                {drinkTypes.map((drinkType) => (
                  <DrinkTypeButton
                    key={drinkType}
                    type={drinkType}
                    selected={type === drinkType}
                    onPress={() => setType(drinkType)}
                    style={styles.drinkTypeButton}
                  />
                ))}
              </View>
            </ScrollView>
            
            <Text style={styles.sectionTitle}>Amount</Text>
            <View style={styles.sliderContainer}>
              <CustomSliderView
                minimumValue={50}
                maximumValue={1000}
                step={10}
                value={amount}
                onValueChange={(value) => setAmount(value)}
                thumbTintColor="#2196F3"
                minimumTrackTintColor="#2196F3"
                unit={settings.measurementUnit}
              />
            </View>
            
            <Text style={styles.sectionTitle}>Note</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note (optional)"
              multiline
            />
            
            <View style={styles.editButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  // Reset to original values
                  setAmount(drinkData.amount);
                  setType(drinkData.type);
                  setNote(drinkData.note || '');
                  setEditMode(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 4,
  },
  detailCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  noteContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  noteText: {
    fontSize: 16,
    color: '#333333',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#2196F3',
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#F44336',
    fontWeight: '600',
    marginLeft: 8,
  },
  editCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    marginTop: 8,
  },
  drinkTypesScroll: {
    marginBottom: 24,
  },
  drinkTypesContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  drinkTypeButton: {
    marginRight: 12,
    minWidth: 120,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  editButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default DrinkDetailScreen;