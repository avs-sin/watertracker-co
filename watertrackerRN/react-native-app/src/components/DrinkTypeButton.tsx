import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrinkType } from '../models/DrinkIntake';

interface DrinkTypeButtonProps {
  type: DrinkType;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const DrinkTypeButton: React.FC<DrinkTypeButtonProps> = ({
  type,
  selected,
  onPress,
  style
}) => {
  const getIconForType = (drinkType: DrinkType): string => {
    switch (drinkType) {
      case 'water': return 'water';
      case 'coffee': return 'coffee';
      case 'tea': return 'tea';
      case 'juice': return 'fruit-citrus';
      case 'soda': return 'bottle-soda';
      case 'milk': return 'cup';
      case 'custom': return 'cup-water';
      default: return 'cup-water';
    }
  };

  const getColorForType = (drinkType: DrinkType): string => {
    switch (drinkType) {
      case 'water': return '#2196F3';  // Blue
      case 'coffee': return '#795548';  // Brown
      case 'tea': return '#FF9800';  // Orange
      case 'juice': return '#FF5722';  // Deep Orange
      case 'soda': return '#F44336';  // Red
      case 'milk': return '#9E9E9E';  // Gray
      case 'custom': return '#9C27B0';  // Purple
      default: return '#2196F3';  // Default blue
    }
  };

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const color = getColorForType(type);
  const icon = getIconForType(type);
  const text = capitalizeFirstLetter(type);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: color },
        selected && { backgroundColor: color },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon
        name={icon}
        size={24}
        color={selected ? '#FFFFFF' : color}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          { color: selected ? '#FFFFFF' : color }
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  }
});

export default DrinkTypeButton;