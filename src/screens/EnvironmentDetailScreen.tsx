import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, SensorReading } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useEnvironments } from '../contexts/EnvironmentsContext';
import { RiskBadge } from '../components/RiskBadge';
import { SensorCard } from '../components/SensorCard';
import { useWeather } from '../hooks/useWeather';
import {
  formatTimestamp,
  getModeEmoji,
  getModeLabel,
  getBatteryColor,
  getRiskColor,
} from '../utils';
import { BorderRadius, FontSize, Spacing } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'EnvironmentDetail'>;

export function EnvironmentDetailScreen({ route, navigation }: Props) {
  const { log } = route.params;
  const { colors } = useTheme();
  const { toggleFavorite, logs } = useEnvironments();
  const { weather } = useWeather(
    log.coordinates?.latitude,
    log.coordinates?.longitude
  );

  // Get latest version from context (favorite state may have changed)
  const currentLog = logs.find((l) => l.id === log.id) ?? log;
  const riskColor = getRiskColor(currentLog.riskLevel, colors);
  const batteryColor = getBatteryColor(currentLog.batteryLevel, colors);

  const sensorKeys = Object.keys(currentLog.sensors) as (keyof SensorReading)[];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View
          style={[
            styles.hero,
            { backgroundColor: `${riskColor}15`, borderBottomColor: `${riskColor}33` },
          ]}
        >
          <View style={styles.heroHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={[styles.back, { color: colors.primary }]}>← Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(currentLog.id)}>
              <Text style={styles.fav}>{currentLog.isFavorite ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.heroName, { color: colors.text }]}>{currentLog.name}</Text>
          <Text style={[styles.heroLocation, { color: colors.textSecondary }]}>
            📍 {currentLog.location}
          </Text>
          {currentLog.coordinates && (
            <Text style={[styles.heroCoords, { color: colors.textMuted }]}>
              {currentLog.coordinates.latitude.toFixed(3)}, {currentLog.coordinates.longitude.toFixed(3)}
            </Text>
          )}

          <View style={styles.heroRow}>
            <RiskBadge risk={currentLog.riskLevel} size="lg" />
            <View style={[styles.modeBadge, { backgroundColor: colors.surfaceElevated }]}>
              <Text style={[styles.modeText, { color: colors.textSecondary }]}>
                {getModeEmoji(currentLog.mode)} {getModeLabel(currentLog.mode)}
              </Text>
            </View>
          </View>
        </View>

        {/* Status row */}
        <View style={styles.statusRow}>
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Bateria</Text>
            <Text style={[styles.statusValue, { color: batteryColor }]}>
              🔋 {currentLog.batteryLevel}%
            </Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Conexão</Text>
            <Text style={[
              styles.statusValue,
              { color: currentLog.hasConnection ? colors.success : colors.warning },
            ]}>
              {currentLog.hasConnection ? '🟢 Online' : '🟡 Offline'}
            </Text>
          </View>
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Última leitura</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              🕐 {formatTimestamp(currentLog.timestamp)}
            </Text>
          </View>
        </View>

        {/* AI Recommendation */}
        <View style={[styles.aiCard, { backgroundColor: `${riskColor}10`, borderColor: `${riskColor}40` }]}>
          <Text style={[styles.aiTitle, { color: colors.text }]}>🤖 Análise de IA</Text>
          <Text style={[styles.aiText, { color: colors.textSecondary }]}>
            {currentLog.aiRecommendation}
          </Text>
        </View>

        {/* Sensors grid */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>📊 Leituras dos Sensores</Text>
          <View style={styles.sensorsGrid}>
            {sensorKeys.map((key) => (
              <SensorCard
                key={key}
                sensorKey={key}
                value={currentLog.sensors[key]}
              />
            ))}
          </View>
        </View>

        {/* Local weather */}
        {weather && (
          <View style={[styles.weatherCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🌍 Clima no Local
            </Text>
            <View style={styles.weatherRow}>
              <Text style={[styles.weatherTemp, { color: colors.primary }]}>
                {Math.round(weather.main.temp)}°C
              </Text>
              <View>
                <Text style={[styles.weatherDesc, { color: colors.textSecondary }]}>
                  {weather.weather[0].description}
                </Text>
                <Text style={[styles.weatherMeta, { color: colors.textMuted }]}>
                  💧 {weather.main.humidity}% · 💨 {weather.wind.speed}m/s
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    paddingBottom: Spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  back: { fontSize: FontSize.md, fontWeight: '600' },
  fav: { fontSize: 22 },
  heroName: { fontSize: FontSize.xxl, fontWeight: '800', marginBottom: 4 },
  heroLocation: { fontSize: FontSize.sm, marginBottom: 2 },
  heroCoords: { fontSize: FontSize.xs, marginBottom: Spacing.md },
  heroRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center', flexWrap: 'wrap' },
  modeBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  modeText: { fontSize: FontSize.sm, fontWeight: '600' },
  statusRow: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  statusCard: {
    flex: 1,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  statusLabel: { fontSize: FontSize.xs, marginBottom: 2 },
  statusValue: { fontSize: FontSize.xs, fontWeight: '700', textAlign: 'center' },
  aiCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
  },
  aiTitle: { fontSize: FontSize.md, fontWeight: '700', marginBottom: Spacing.sm },
  aiText: { fontSize: FontSize.sm, lineHeight: 22 },
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', marginBottom: Spacing.sm },
  sensorsGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: -Spacing.xs },
  weatherCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
  },
  weatherRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.sm },
  weatherTemp: { fontSize: FontSize.xxxl, fontWeight: '800' },
  weatherDesc: { fontSize: FontSize.sm, textTransform: 'capitalize' },
  weatherMeta: { fontSize: FontSize.xs, marginTop: 4 },
});
