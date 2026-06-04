import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RiskLevel } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getRiskColor, getRiskLabel, getRiskEmoji } from '../utils';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface Props {
  risk: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ risk, size = 'md' }: Props) {
  const { colors } = useTheme();
  const color = getRiskColor(risk, colors);
  const label = getRiskLabel(risk);
  const emoji = getRiskEmoji(risk);

  const fontSize = size === 'sm' ? FontSize.xs : size === 'lg' ? FontSize.md : FontSize.sm;
  const paddingH = size === 'sm' ? Spacing.sm : Spacing.md;
  const paddingV = size === 'sm' ? 2 : size === 'lg' ? Spacing.sm : 4;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: `${color}22`,
          borderColor: `${color}55`,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
        },
      ]}
    >
      <Text style={[styles.text, { color, fontSize }]}>
        {emoji} {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
