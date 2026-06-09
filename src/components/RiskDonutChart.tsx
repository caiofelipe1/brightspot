import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';
import { FontSize, Spacing } from '../theme';

interface Props {
  critical: number;
  attention: number;
  safe: number;
}

const R = 52;
const SW = 22;
const C = 2 * Math.PI * R;
const SIZE = (R + SW) * 2 + 4;
const CX = SIZE / 2;
const CY = SIZE / 2;

export function RiskDonutChart({ critical, attention, safe }: Props) {
  const { colors } = useTheme();
  const total = critical + attention + safe;

  if (total === 0) return null;

  const segments = [
    { value: critical, color: colors.danger, label: 'Crítico' },
    { value: attention, color: colors.warning, label: 'Atenção' },
    { value: safe, color: colors.success, label: 'Seguro' },
  ];

  let cumAngle = 0;

  return (
    <View style={styles.wrap}>
      <View>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            cx={CX} cy={CY} r={R}
            stroke={colors.border}
            strokeWidth={SW}
            fill="none"
          />
          {segments.map((seg) => {
            if (seg.value === 0) return null;
            const ratio = seg.value / total;
            const dash = ratio * C;
            const rot = cumAngle - 90;
            cumAngle += ratio * 360;
            return (
              <Circle
                key={seg.label}
                cx={CX} cy={CY} r={R}
                stroke={seg.color}
                strokeWidth={SW}
                fill="none"
                strokeDasharray={[dash, C - dash]}
                strokeDashoffset={0}
                rotation={rot}
                origin={`${CX}, ${CY}`}
              />
            );
          })}
        </Svg>
        <View style={[styles.center, { width: SIZE, height: SIZE }]}>
          <Text style={[styles.total, { color: colors.text }]}>{total}</Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>total</Text>
        </View>
      </View>

      <View style={styles.legend}>
        {segments.map((seg) => (
          <View key={seg.label} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: seg.color }]} />
            <Text style={[styles.lbl, { color: colors.textSecondary }]}>{seg.label}</Text>
            <Text style={[styles.val, { color: seg.color }]}>{seg.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  total: { fontSize: FontSize.xxl, fontWeight: '800' },
  sub: { fontSize: FontSize.xs, marginTop: -2 },
  legend: { gap: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, minWidth: 110 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  lbl: { fontSize: FontSize.sm, flex: 1 },
  val: { fontSize: FontSize.lg, fontWeight: '800' },
});
