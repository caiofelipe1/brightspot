import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SensorReading } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getSensorLabel, getSensorUnit } from '../utils';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface Props {
  sensors: SensorReading;
}

const SENSOR_MAX: Record<keyof SensorReading, number> = {
  temperature: 50,
  humidity: 100,
  luminosity: 500,
  airQuality: 300,
  vibration: 10,
};

const SENSOR_WARN: Record<keyof SensorReading, number> = {
  temperature: 35,
  humidity: 75,
  luminosity: 400,
  airQuality: 100,
  vibration: 4,
};

const SENSOR_CRIT: Record<keyof SensorReading, number> = {
  temperature: 45,
  humidity: 90,
  luminosity: 450,
  airQuality: 200,
  vibration: 7,
};

function getBarColor(key: keyof SensorReading, value: number, colors: any): string {
  if (value >= SENSOR_CRIT[key]) return colors.danger;
  if (value >= SENSOR_WARN[key]) return colors.warning;
  return colors.success;
}

interface BarProps {
  sensorKey: keyof SensorReading;
  value: number;
  colors: any;
}

function SensorBar({ sensorKey, value, colors }: BarProps) {
  const ratio = Math.min(Math.max(value / SENSOR_MAX[sensorKey], 0), 1);
  const color = getBarColor(sensorKey, value, colors);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: ratio,
      duration: 700,
      useNativeDriver: false,
    }).start();
  }, [ratio]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.barRow}>
      <Text style={[styles.barLabel, { color: colors.textSecondary }]} numberOfLines={1}>
        {getSensorLabel(sensorKey)}
      </Text>
      <View style={styles.barTrack}>
        <View style={[styles.barBg, { backgroundColor: colors.border }]}>
          <Animated.View style={[styles.barFill, { width: width as any, backgroundColor: color }]} />
        </View>
        <Text style={[styles.barValue, { color }]}>
          {value.toFixed(1)} {getSensorUnit(sensorKey)}
        </Text>
      </View>
    </View>
  );
}

export function SensorChart({ sensors }: Props) {
  const { colors } = useTheme();
  const keys = Object.keys(sensors) as (keyof SensorReading)[];

  return (
    <View style={styles.container}>
      {keys.map((key) => (
        <SensorBar key={key} sensorKey={key} value={sensors[key]} colors={colors} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  barRow: { gap: 4 },
  barLabel: { fontSize: FontSize.xs, fontWeight: '600' },
  barTrack: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  barBg: {
    flex: 1,
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BorderRadius.full },
  barValue: { fontSize: FontSize.xs, fontWeight: '700', width: 72, textAlign: 'right' },
});
