import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Thermometer, Droplets, Sun, Wind, Activity } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;
import { getSensorLabel, getSensorUnit } from '../utils';
import { SensorReading } from '../types';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface Props {
  sensorKey: keyof SensorReading;
  value: number;
}

const SENSOR_ICONS: Record<keyof SensorReading, IconComponent> = {
  temperature: Thermometer,
  humidity: Droplets,
  luminosity: Sun,
  airQuality: Wind,
  vibration: Activity,
};

export function SensorCard({ sensorKey, value }: Props) {
  const { colors } = useTheme();
  const Icon = SENSOR_ICONS[sensorKey];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Icon size={22} color={colors.primary} />
      <Text style={[styles.value, { color: colors.primary }]}>
        {value.toFixed(1)}
        <Text style={[styles.unit, { color: colors.textSecondary }]}>
          {' '}{getSensorUnit(sensorKey)}
        </Text>
      </Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {getSensorLabel(sensorKey)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
    minWidth: 90,
    flex: 1,
    margin: Spacing.xs,
    gap: Spacing.xs,
  },
  value: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  unit: {
    fontSize: FontSize.xs,
    fontWeight: '400',
  },
  label: {
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});
