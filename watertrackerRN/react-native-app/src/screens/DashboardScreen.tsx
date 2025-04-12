import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store';
import CircularProgressView from '../components/CircularProgressView';
import IntakeProgressView from '../components/IntakeProgressView';
import { DrinkType } from '../models/DrinkIntake';
import { addIntake } from '../store/intakeSlice';
import { v4 as uuidv4 } from 'uuid';
import { saveDailyIntakes } from '../utils/storage';

const DashboardScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  const dailyIntakes = useSelector((state: RootState) => state.intake.dailyIntakes);
  
  // Get today's date in format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's intakes
  const todayData = dailyIntakes[today] || { intakes: [], totalAmount: 0 };
  const { intakes, totalAmount } = todayData;
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((totalAmount / settings.dailyGoal) * 100),
    100
  );
  
  // Get remaining amount
  const remainingAmount = Math.max(settings.dailyGoal - totalAmount, 0);
  
  // Format date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  
  // Quick add common amounts
  const quickAddWater = async (amount: number) => {
    const newIntake = {
      id: uuidv4(),
      amount,
      type: 'water' as DrinkType,
      timestamp: Date.now()
    };
    
    dispatch(addIntake(newIntake));
    
    try {
      // Save to storage (in real implementation the updated state would be retrieved after dispatch)
      await saveDailyIntakes(dailyIntakes);
    } catch (error) {
      console.error('Error saving intake:', error);
    }
  };
  
  // Calculate statistics
  const drinkTypeStats = intakes.reduce((acc, intake) => {
    if (!acc[intake.type]) {
      acc[intake.type] = 0;
    }
    acc[intake.type] += intake.amount;
    return acc;
  }, {} as Record<DrinkType, number>);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {settings.username || 'Hydration Hero'}!</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        {settings.avatar && (
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={{ uri: settings.avatar }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        )}
        
        {!settings.avatar && (
          <TouchableOpacity
            style={styles.avatarPlaceholder}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="account" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <CircularProgressView
          progress={progressPercentage}
          size={180}
          strokeWidth={15}
          color="#2196F3"
          backgroundColor="#E0E0E0"
        >
          <View style={styles.progressCenter}>
            <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
            <Text style={styles.progressLabel}>of daily goal</Text>
          </View>
        </CircularProgressView>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalAmount}</Text>
            <Text style={styles.statLabel}>{settings.measurementUnit} consumed</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{remainingAmount}</Text>
            <Text style={styles.statLabel}>{settings.measurementUnit} remaining</Text>
          </View>
        </View>
        
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.addDrinkButton}
            onPress={() => navigation.navigate('Drinks')}
          >
            <Icon name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.addDrinkButtonText}>Add Drink</Text>
          </TouchableOpacity>
          
          <Text style={styles.quickAddLabel}>Quick Add Water:</Text>
          
          <View style={styles.quickAddButtons}>
            {[200, 250, 300].map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAddButton}
                onPress={() => quickAddWater(amount)}
              >
                <Text style={styles.quickAddButtonText}>{amount} {settings.measurementUnit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      
      {intakes.length > 0 && (
        <View style={styles.intakeBreakdown}>
          <Text style={styles.sectionTitle}>Today's Intake Breakdown</Text>
          
          <View style={styles.intakeBreakdownContent}>
            {Object.entries(drinkTypeStats).map(([type, amount]) => (
              <IntakeProgressView
                key={type}
                drinkType={type as DrinkType}
                amount={amount}
                percentage={(amount / totalAmount) * 100}
              />
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.recentActivity}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {intakes.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="water-off" size={48} color="#DDDDDD" />
            <Text style={styles.emptyStateTitle}>No drinks yet today</Text>
            <Text style={styles.emptyStateMessage}>
              Start tracking your hydration by adding your first drink
            </Text>
          </View>
        )}
        
        {intakes.length > 0 && (
          <View style={styles.activityList}>
            {intakes
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 3)
              .map((intake) => (
                <TouchableOpacity
                  key={intake.id}
                  style={styles.activityItem}
                  onPress={() => navigation.navigate('History')}
                >
                  <View style={styles.activityItemLeft}>
                    <Icon
                      name={intake.type === 'water' ? 'water' : 'cup'}
                      size={24}
                      color={intake.type === 'water' ? '#2196F3' : '#9E9E9E'}
                      style={styles.activityItemIcon}
                    />
                    <View style={styles.activityItemDetails}>
                      <Text style={styles.activityItemTitle}>
                        {intake.amount} {settings.measurementUnit} of {intake.type}
                      </Text>
                      <Text style={styles.activityItemTime}>
                        {new Date(intake.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={24} color="#CCCCCC" />
                </TouchableOpacity>
              ))}
          </View>
        )}
      </View>
      
      <View style={styles.tipsContainer}>
        <Text style={styles.sectionTitle}>Hydration Tip</Text>
        
        <View style={styles.tipCard}>
          <Icon name="lightbulb-on" size={24} color="#FFB300" style={styles.tipIcon} />
          <Text style={styles.tipText}>
            Drinking water before meals can help with digestion and may reduce overall calorie intake.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
  },
  date: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  progressCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2196F3',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    height: '100%',
  },
  quickActions: {
    width: '100%',
    marginTop: 24,
  },
  addDrinkButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  addDrinkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickAddLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickAddButtonText: {
    color: '#2196F3',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    color: '#2196F3',
    fontWeight: '500',
  },
  intakeBreakdown: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  intakeBreakdownContent: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  recentActivity: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  emptyState: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  activityList: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  activityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityItemIcon: {
    marginRight: 12,
  },
  activityItemDetails: {},
  activityItemTitle: {
    fontSize: 16,
  },
  activityItemTime: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  tipsContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  tipCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#FFB300',
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },
});

export default DashboardScreen;