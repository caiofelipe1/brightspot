import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft, Star, MapPin, Clock, Battery,
  Wifi, WifiOff, Bot, BarChart3, Globe,
  Compass, BatteryCharging, Archive, Bell,
  Droplets, Wind,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, SensorReading, OperationMode } from '../types';

type IconComponent = React.ComponentType<{ size?: number; color?: string; fill?: string }>;
import { useTheme } from '../contexts/ThemeContext';
import { useEnvironments } from '../contexts/EnvironmentsContext';
import { RiskBadge } from '../components/RiskBadge';
import { SensorCard } from '../components/SensorCard';
import { SensorChart } from '../components/SensorChart';
import { useWeather } from '../hooks/useWeather';
import {
  formatTimestamp,
  getModeLabel,
  getBatteryColor,
  getRiskColor,
} from '../utils';
import { BorderRadius, FontSize, Spacing } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'EnvironmentDetail'>;

const MODE_ICONS: Record<OperationMode, IconComponent> = {
  exploration: Compass,
  economy: BatteryCharging,
  blackbox: Archive,
  alert: Bell,
};

export function EnvironmentDetailScreen({ route, navigation }: Props) {
  const { log } = route.params;
  const { colors } = useTheme();
  const { toggleFavorite, logs } = useEnvironments();
  const { weather } = useWeather(
    log.coordinates?.latitude,
    log.coordinates?.longitude
  );

  const currentLog = logs.find((l) => l.id === log.id) ?? log;
  const riskColor = getRiskColor(currentLog.riskLevel, colors);
  const batteryColor = getBatteryColor(currentLog.batteryLevel, colors);
  const sensorKeys = Object.keys(currentLog.sensors) as (keyof SensorReading)[];
  const ModeIcon = MODE_ICONS[currentLog.mode];

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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ChevronLeft size={20} color={colors.primary} />
              <Text style={[styles.back, { color: colors.primary }]}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleFavorite(currentLog.id)}>
              <Star
                size={22}
                color={currentLog.isFavorite ? colors.warning : colors.textMuted}
                fill={currentLog.isFavorite ? colors.warning : 'transparent'}
              />
            </TouchableOpacity>
          </View>

          <Text style={[styles.heroName, { color: colors.text }]}>{currentLog.name}</Text>

          <View style={styles.infoRow}>
            <MapPin size={13} color={colors.textSecondary} />
            <Text style={[styles.heroLocation, { color: colors.textSecondary }]}>
              {currentLog.location}
            </Text>
          </View>

          {currentLog.coordinates && (
            <Text style={[styles.heroCoords, { color: colors.textMuted }]}>
              {currentLog.coordinates.latitude.toFixed(3)}, {currentLog.coordinates.longitude.toFixed(3)}
            </Text>
          )}

          <View style={styles.heroRow}>
            <RiskBadge risk={currentLog.riskLevel} size="lg" />
            <View style={[styles.modeBadge, { backgroundColor: colors.surfaceElevated }]}>
              <ModeIcon size={13} color={colors.textSecondary} />
              <Text style={[styles.modeText, { color: colors.textSecondary }]}>
                {getModeLabel(currentLog.mode)}
              </Text>
            </View>
          </View>
        </View>

        {/* Status row */}
        <View style={styles.statusRow}>
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Bateria</Text>
            <View style={styles.infoRow}>
              <Battery size={14} color={batteryColor} />
              <Text style={[styles.statusValue, { color: batteryColor }]}>
                {currentLog.batteryLevel}%
              </Text>
            </View>
          </View>
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Conexão</Text>
            <View style={styles.infoRow}>
              {currentLog.hasConnection ? (
                <Wifi size={14} color={colors.success} />
              ) : (
                <WifiOff size={14} color={colors.warning} />
              )}
              <Text style={[
                styles.statusValue,
                { color: currentLog.hasConnection ? colors.success : colors.warning },
              ]}>
                {currentLog.hasConnection ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
          <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statusLabel, { color: colors.textMuted }]}>Última leitura</Text>
            <View style={styles.infoRow}>
              <Clock size={12} color={colors.text} />
              <Text style={[styles.statusValue, { color: colors.text }]}>
                {formatTimestamp(currentLog.timestamp)}
              </Text>
            </View>
          </View>
        </View>

        {/* AI Recommendation */}
        <View style={[styles.aiCard, { backgroundColor: `${riskColor}10`, borderColor: `${riskColor}40` }]}>
          <View style={styles.infoRow}>
            <Bot size={17} color={colors.text} />
            <Text style={[styles.aiTitle, { color: colors.text }]}>Análise de IA</Text>
          </View>
          <Text style={[styles.aiText, { color: colors.textSecondary }]}>
            {currentLog.aiRecommendation}
          </Text>
        </View>

        {/* Sensor chart */}
        <View style={[styles.sensorChartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <BarChart3 size={17} color={colors.text} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Gráfico de Sensores</Text>
          </View>
          <SensorChart sensors={currentLog.sensors} />
        </View>

        {/* Sensors grid */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <BarChart3 size={17} color={colors.text} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Leituras dos Sensores</Text>
          </View>
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
            <View style={styles.infoRow}>
              <Globe size={17} color={colors.text} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Clima no Local</Text>
            </View>
            <View style={styles.weatherRow}>
              <Text style={[styles.weatherTemp, { color: colors.primary }]}>
                {Math.round(weather.main.temp)}°C
              </Text>
              <View style={{ gap: 4 }}>
                <Text style={[styles.weatherDesc, { color: colors.textSecondary }]}>
                  {weather.weather[0].description}
                </Text>
                <View style={styles.infoRow}>
                  <Droplets size={12} color={colors.textMuted} />
                  <Text style={[styles.weatherMeta, { color: colors.textMuted }]}>
                    {weather.main.humidity}%
                  </Text>
                  <Text style={{ color: colors.textMuted }}> · </Text>
                  <Wind size={12} color={colors.textMuted} />
                  <Text style={[styles.weatherMeta, { color: colors.textMuted }]}>
                    {weather.wind.speed}m/s
                  </Text>
                </View>
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
    gap: 6,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  back: { fontSize: FontSize.md, fontWeight: '600' },
  heroName: { fontSize: FontSize.xxl, fontWeight: '800' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroLocation: { fontSize: FontSize.sm, flex: 1 },
  heroCoords: { fontSize: FontSize.xs },
  heroRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    gap: 4,
  },
  statusLabel: { fontSize: FontSize.xs },
  statusValue: { fontSize: FontSize.xs, fontWeight: '700', textAlign: 'center' },
  aiCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  aiTitle: { fontSize: FontSize.md, fontWeight: '700' },
  aiText: { fontSize: FontSize.sm, lineHeight: 22 },
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md, gap: Spacing.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700' },
  sensorsGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: -Spacing.xs },
  sensorChartCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  weatherCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  weatherRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  weatherTemp: { fontSize: FontSize.xxxl, fontWeight: '800' },
  weatherDesc: { fontSize: FontSize.sm, textTransform: 'capitalize' },
  weatherMeta: { fontSize: FontSize.xs },
});
