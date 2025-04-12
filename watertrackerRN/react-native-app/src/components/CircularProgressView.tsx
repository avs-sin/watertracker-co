import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressViewProps {
  percentage: number;
  radius: number;
  strokeWidth: number;
  duration?: number;
  color?: string;
  textColor?: string;
  unit?: string;
  current?: number;
  max?: number;
}

const CircularProgressView: React.FC<CircularProgressViewProps> = ({
  percentage,
  radius,
  strokeWidth,
  duration = 500,
  color = '#2196F3',
  textColor = '#333333',
  unit = '',
  current,
  max
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>(null);
  
  const center = radius;
  const circumference = 2 * Math.PI * radius;
  
  // Limit percentage to 0-100 range
  const safePercentage = Math.min(Math.max(percentage, 0), 100);
  
  useEffect(() => {
    // Animate the progress when component mounts or percentage changes
    Animated.timing(animatedValue, {
      toValue: safePercentage,
      duration: duration,
      useNativeDriver: true
    }).start();
    
    // Update the stroke-dashoffset of the circle using the animated value
    const listener = animatedValue.addListener(({ value }) => {
      if (circleRef.current) {
        const strokeDashoffset = circumference - (circumference * value) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset
        });
      }
    });
    
    // Clean up listener on unmount
    return () => {
      animatedValue.removeListener(listener);
    };
  }, [percentage, circumference, animatedValue, duration]);
  
  // Format percentage to always show as integer
  const displayPercentage = Math.round(safePercentage);
  
  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <Circle
          ref={circleRef}
          cx={center}
          cy={center}
          r={radius - strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * safePercentage) / 100}
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      
      <View style={styles.textContainer}>
        {current !== undefined && max !== undefined ? (
          <>
            <Text style={[styles.valueText, { color: textColor }]}>
              {current}
            </Text>
            <Text style={[styles.unitText, { color: textColor }]}>
              {unit}
            </Text>
            <Text style={[styles.maxText, { color: textColor }]}>
              of {max} {unit}
            </Text>
          </>
        ) : (
          <Text style={[styles.percentText, { color: textColor }]}>
            {displayPercentage}%
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 32,
    fontWeight: '700',
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: -5,
  },
  maxText: {
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.7,
    marginTop: 4,
  },
  percentText: {
    fontSize: 32,
    fontWeight: '700',
  },
});

export default CircularProgressView;