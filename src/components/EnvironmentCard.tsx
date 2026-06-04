import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { EnvironmentLog } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useEnvironments } from '../contexts/EnvironmentsContext';
import { RiskBadge } from './RiskBadge';
import {
  formatTimestamp,
  getModeEmoji,
  getModeLabel,
  getBatteryColor,
  getRiskColor,
} from '../utils';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface Props {
  log: EnvironmentLog;
  onPress: () => void;
}

export function EnvironmentCard({ log, onPress }: Props) {
  const { colors } = useTheme();
  const { toggleFavorite } = useEnvironments();
  const batteryColor = getBatteryColor(log.batteryLevel, colors);
  const riskColor = getRiskColor(log.riskLevel, colors);

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
          <TouchableOpacity onPress={() => toggleFavorite(log.id)}>
            <Text style={styles.fav}>{log.isFavorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
          📍 {log.location}
        </Text>
      </View>

      {/* Badges row */}
      <View style={styles.row}>
        <RiskBadge risk={log.riskLevel} size="sm" />
        <View style={[styles.modeBadge, { backgroundColor: colors.surfaceElevated }]}>
          <Text style={[styles.modeText, { color: colors.textSecondary }]}>
            {getModeEmoji(log.mode)} {getModeLabel(log.mode)}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          🕐 {formatTimestamp(log.timestamp)}
        </Text>
        <View style={styles.battery}>
          <View
            style={[
              styles.batteryBar,
              { backgroundColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.batteryFill,
                {
                  backgroundColor: batteryColor,
                  width: `${log.batteryLevel}%` as any,
                },
              ]}
            />
          </View>
          <Text style={[styles.batteryText, { color: batteryColor }]}>
            {log.batteryLevel}%
          </Text>
          {!log.hasConnection && (
            <Text style={[styles.offline, { color: colors.warning }]}>
              {' '}📦 Offline
            </Text>
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
  fav: {
    fontSize: 18,
  },
  location: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  modeBadge: {
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
  offline: {
    fontSize: FontSize.xs,
  },
});
