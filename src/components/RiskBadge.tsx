import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react-native';
import { RiskLevel } from '../types';

type IconComponent = React.ComponentType<{ size?: number; color?: string; fill?: string }>;
import { useTheme } from '../contexts/ThemeContext';
import { getRiskColor, getRiskLabel } from '../utils';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface Props {
  risk: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const RISK_ICONS: Record<RiskLevel, IconComponent> = {
  safe: CheckCircle2,
  attention: AlertTriangle,
  critical: AlertOctagon,
  unknown: HelpCircle,
};

export function RiskBadge({ risk, size = 'md' }: Props) {
  const { colors } = useTheme();
  const color = getRiskColor(risk, colors);
  const label = getRiskLabel(risk);
  const Icon = RISK_ICONS[risk];

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
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
      <View style={styles.inner}>
        <Icon size={iconSize} color={color} />
        <Text style={[styles.text, { color, fontSize }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
