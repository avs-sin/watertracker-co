import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface CustomSliderViewProps {
  minimumValue: number;
  maximumValue: number;
  step: number;
  value: number;
  onValueChange: (value: number) => void;
  thumbTintColor?: string;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  showValue?: boolean;
  unit?: string;
}

const CustomSliderView: React.FC<CustomSliderViewProps> = ({
  minimumValue,
  maximumValue,
  step,
  value,
  onValueChange,
  thumbTintColor = '#2196F3',
  minimumTrackTintColor = '#2196F3',
  maximumTrackTintColor = '#E0E0E0',
  showValue = true,
  unit = ''
}) => {
  const [localValue, setLocalValue] = useState(value);
  
  const handleValueChange = (newValue: number) => {
    setLocalValue(newValue);
  };
  
  const handleSlidingComplete = (finalValue: number) => {
    onValueChange(finalValue);
  };
  
  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={handleValueChange}
        onSlidingComplete={handleSlidingComplete}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
      />
      
      <View style={styles.labelsContainer}>
        <Text style={styles.labelText}>{minimumValue}{unit}</Text>
        
        {showValue && (
          <View style={styles.valueContainer}>
            <Text style={styles.valueText}>{localValue}{unit}</Text>
          </View>
        )}
        
        <Text style={styles.labelText}>{maximumValue}{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginTop: -10,
  },
  labelText: {
    fontSize: 12,
    color: '#666666',
  },
  valueContainer: {
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  valueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CustomSliderView;