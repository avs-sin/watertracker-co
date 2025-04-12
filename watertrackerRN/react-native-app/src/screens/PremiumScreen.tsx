import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { setPremiumStatus } from '../store/settingsSlice';
import { saveUserSettings } from '../utils/storage';
import { RootState } from '../store';

const PremiumScreen: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);
  
  const handlePurchase = async () => {
    // In a real app, this would connect to in-app purchase API
    // For this demo, we'll just toggle the premium status
    const newPremiumStatus = !settings.premiumUser;
    
    dispatch(setPremiumStatus(newPremiumStatus));
    
    // Save to AsyncStorage
    await saveUserSettings({
      ...settings,
      premiumUser: newPremiumStatus
    });
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Icon name="crown" size={48} color="#FFD700" style={styles.crownIcon} />
        <Text style={styles.title}>WaterTracker Premium</Text>
        <Text style={styles.subtitle}>
          Unlock all features and enhance your hydration experience
        </Text>
      </View>
      
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>Premium Benefits</Text>
        
        {[
          { icon: 'chart-line', text: 'Advanced analytics and hydration insights' },
          { icon: 'chart-timeline-variant', text: 'Detailed history and trends' },
          { icon: 'palette', text: 'Custom themes and app appearance' },
          { icon: 'sync', text: 'Cross-device sync via cloud' },
          { icon: 'bell', text: 'Smart reminders based on your habits' },
          { icon: 'export-variant', text: 'Export data to CSV or PDF' },
          { icon: 'delete', text: 'No advertisements' }
        ].map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Icon name={benefit.icon} size={24} color="#2196F3" />
            <Text style={styles.benefitText}>{benefit.text}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.pricingContainer}>
        <View style={styles.pricingCard}>
          <Text style={styles.planName}>Annual Plan</Text>
          <Text style={styles.planPrice}>$19.99<Text style={styles.planPeriod}>/year</Text></Text>
          <Text style={styles.planSaving}>Save 70% compared to monthly</Text>
          <TouchableOpacity 
            style={[styles.purchaseButton, styles.primaryButton]}
            onPress={handlePurchase}
          >
            <Text style={styles.purchaseButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.pricingCard}>
          <Text style={styles.planName}>Monthly Plan</Text>
          <Text style={styles.planPrice}>$4.99<Text style={styles.planPeriod}>/month</Text></Text>
          <Text style={styles.planFeature}>Try premium with no commitment</Text>
          <TouchableOpacity 
            style={[styles.purchaseButton, styles.secondaryButton]}
            onPress={handlePurchase}
          >
            <Text style={styles.secondaryButtonText}>Subscribe Now</Text>
          </TouchableOpacity>
        </View>
        
        {settings.premiumUser && (
          <View style={styles.currentPlanContainer}>
            <Icon name="check-circle" size={24} color="#4CAF50" />
            <Text style={styles.currentPlanText}>
              You are currently subscribed to Premium
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.restoreContainer}>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.termsText}>Terms & Privacy Policy</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 24,
  },
  crownIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  benefitsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333333',
    flex: 1,
  },
  pricingContainer: {
    marginBottom: 24,
  },
  pricingCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 8,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666',
  },
  planSaving: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 16,
  },
  planFeature: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  purchaseButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#2196F3',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  currentPlanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  currentPlanText: {
    fontSize: 16,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
  restoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  restoreText: {
    fontSize: 14,
    color: '#2196F3',
  },
  termsText: {
    fontSize: 14,
    color: '#2196F3',
  },
});

export default PremiumScreen;