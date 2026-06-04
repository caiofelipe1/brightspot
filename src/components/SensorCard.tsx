import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { getSensorEmoji, getSensorLabel, getSensorUnit } from '../utils';
import { SensorReading } from '../types';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface Props {
  sensorKey: keyof SensorReading;
  value: number;
}

export function SensorCard({ sensorKey, value }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={styles.emoji}>{getSensorEmoji(sensorKey)}</Text>
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
  },
  emoji: {
    fontSize: 22,
    marginBottom: Spacing.xs,
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
    marginTop: 2,
    textAlign: 'center',
  },
});
