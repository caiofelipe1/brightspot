import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  MapPin, Clock, Wifi, WifiOff, Star, Trash2,
  Compass, BatteryCharging, Archive, Bell,
} from 'lucide-react-native';
import { EnvironmentLog, OperationMode } from '../types';

type IconComponent = React.ComponentType<{ size?: number; color?: string; fill?: string }>;
import { useTheme } from '../contexts/ThemeContext';
import { useEnvironments } from '../contexts/EnvironmentsContext';
import { RiskBadge } from './RiskBadge';
import { formatTimestamp, getModeLabel, getBatteryColor, getRiskColor } from '../utils';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface Props {
  log: EnvironmentLog;
  onPress: () => void;
  onDelete?: () => void;
}

const MODE_ICONS: Record<OperationMode, IconComponent> = {
  exploration: Compass,
  economy: BatteryCharging,
  blackbox: Archive,
  alert: Bell,
};

export function EnvironmentCard({ log, onPress, onDelete }: Props) {
  const { colors } = useTheme();
  const { toggleFavorite } = useEnvironments();
  const batteryColor = getBatteryColor(log.batteryLevel, colors);
  const riskColor = getRiskColor(log.riskLevel, colors);
  const ModeIcon = MODE_ICONS[log.mode];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderLeftColor: riskColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {log.name}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => toggleFavorite(log.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
              <Star
                size={18}
                color={log.isFavorite ? colors.warning : colors.textMuted}
                fill={log.isFavorite ? colors.warning : 'transparent'}
              />
            </TouchableOpacity>
            {onDelete && (
              <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
                <Trash2 size={16} color={colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.infoRow}>
          <MapPin size={12} color={colors.textSecondary} />
          <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
            {log.location}
          </Text>
        </View>
      </View>

      {/* Badges row */}
      <View style={styles.row}>
        <RiskBadge risk={log.riskLevel} size="sm" />
        <View style={[styles.modeBadge, { backgroundColor: colors.surfaceElevated }]}>
          <ModeIcon size={11} color={colors.textSecondary} />
          <Text style={[styles.modeText, { color: colors.textSecondary }]}>
            {getModeLabel(log.mode)}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <Clock size={11} color={colors.textMuted} />
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {formatTimestamp(log.timestamp)}
          </Text>
        </View>
        <View style={styles.battery}>
          <View style={[styles.batteryBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.batteryFill,
                { backgroundColor: batteryColor, width: `${log.batteryLevel}%` as any },
              ]}
            />
          </View>
          <Text style={[styles.batteryText, { color: batteryColor }]}>
            {log.batteryLevel}%
          </Text>
          {log.hasConnection ? (
            <Wifi size={12} color={colors.success} />
          ) : (
            <WifiOff size={12} color={colors.warning} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    marginBottom: Spacing.sm,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: '700',
    flex: 1,
    marginRight: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: FontSize.sm,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  modeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: FontSize.xs,
  },
  battery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  batteryBar: {
    width: 40,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 3,
  },
  batteryText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
});
