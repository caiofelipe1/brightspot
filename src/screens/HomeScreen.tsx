import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  AlertOctagon, AlertTriangle, CheckCircle2, Radio,
  Globe, Satellite, Rocket, MapPin, Clock, Bot, BarChart3,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type IconComponent = React.ComponentType<{ size?: number; color?: string }>;
import { HomeStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useEnvironments } from '../contexts/EnvironmentsContext';
import { useApod } from '../hooks/useNasa';
import { useWeather } from '../hooks/useWeather';
import { RiskBadge } from '../components/RiskBadge';
import { RiskDonutChart } from '../components/RiskDonutChart';
import { Skeleton } from '../components/Skeleton';
import { formatTimestamp, getRiskColor } from '../utils';
import { BorderRadius, FontSize, Spacing } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { logs } = useEnvironments();
  const [refreshKey, setRefreshKey] = useState(0);
  const { apod, isLoading: apodLoading } = useApod(refreshKey);
  const { weather } = useWeather(undefined, undefined, refreshKey);
  const [refreshing, setRefreshing] = React.useState(false);
  const [apodImageError, setApodImageError] = useState(false);

  const criticalCount = logs.filter((l) => l.riskLevel === 'critical').length;
  const attentionCount = logs.filter((l) => l.riskLevel === 'attention').length;
  const safeCount = logs.filter((l) => l.riskLevel === 'safe').length;
  const recentLogs = logs.slice(0, 3);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Sistema de Inteligência Ambiental
            </Text>
            <Text style={[styles.brand, { color: colors.text }]}>
              Bright<Text style={{ color: colors.primary }}>Spot</Text>
            </Text>
          </View>
          <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard label="Críticos" value={criticalCount} color={colors.danger} icon={AlertOctagon} colors={colors} />
          <StatCard label="Atenção" value={attentionCount} color={colors.warning} icon={AlertTriangle} colors={colors} />
          <StatCard label="Seguros" value={safeCount} color={colors.success} icon={CheckCircle2} colors={colors} />
          <StatCard label="Total" value={logs.length} color={colors.primary} icon={Radio} colors={colors} />
        </View>

        {/* Risk distribution chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionTitle}>
            <BarChart3 size={17} color={colors.text} />
            <Text style={[styles.sectionTitleText, { color: colors.text }]}>Distribuição de Risco</Text>
          </View>
          <RiskDonutChart critical={criticalCount} attention={attentionCount} safe={safeCount} />
        </View>

        {/* Weather card */}
        {weather && (
          <View style={[styles.weatherCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.sectionTitle}>
              <Globe size={17} color={colors.text} />
              <Text style={[styles.sectionTitleText, { color: colors.text }]}>Condições Externas</Text>
            </View>
            <View style={styles.weatherRow}>
              <View>
                <Text style={[styles.weatherTemp, { color: colors.primary }]}>
                  {Math.round(weather.main.temp)}°C
                </Text>
                <Text style={[styles.weatherDesc, { color: colors.textSecondary }]}>
                  {weather.weather[0].description}
                </Text>
                <View style={styles.infoRow}>
                  <MapPin size={11} color={colors.textMuted} />
                  <Text style={[styles.weatherCity, { color: colors.textMuted }]}>
                    {weather.name}, {weather.sys.country}
                  </Text>
                </View>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.infoRow}>
                  <Globe size={13} color={colors.textSecondary} />
                  <Text style={[styles.weatherMeta, { color: colors.textSecondary }]}>
                    Umidade: {weather.main.humidity}%
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Satellite size={13} color={colors.textSecondary} />
                  <Text style={[styles.weatherMeta, { color: colors.textSecondary }]}>
                    Vento: {weather.wind.speed} m/s
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <AlertTriangle size={13} color={colors.textSecondary} />
                  <Text style={[styles.weatherMeta, { color: colors.textSecondary }]}>
                    Sensação: {Math.round(weather.main.feels_like)}°C
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Recent environments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitle}>
              <Satellite size={17} color={colors.text} />
              <Text style={[styles.sectionTitleText, { color: colors.text }]}>Leituras Recentes</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('NasaGallery')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>NASA →</Text>
            </TouchableOpacity>
          </View>

          {recentLogs.map((log) => (
            <TouchableOpacity
              key={log.id}
              style={[
                styles.recentCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderLeftColor: getRiskColor(log.riskLevel, colors),
                },
              ]}
              onPress={() => navigation.navigate('EnvironmentDetail', { log })}
              activeOpacity={0.8}
            >
              <View style={styles.recentHeader}>
                <Text style={[styles.recentName, { color: colors.text }]} numberOfLines={1}>
                  {log.name}
                </Text>
                <RiskBadge risk={log.riskLevel} size="sm" />
              </View>
              <View style={styles.metaRow}>
                <MapPin size={11} color={colors.textMuted} />
                <Text style={[styles.recentMeta, { color: colors.textMuted }]} numberOfLines={1}>
                  {log.location}
                </Text>
                <Text style={[styles.recentMeta, { color: colors.textMuted }]}> · </Text>
                <Clock size={11} color={colors.textMuted} />
                <Text style={[styles.recentMeta, { color: colors.textMuted }]}>
                  {formatTimestamp(log.timestamp)}
                </Text>
              </View>
              <View style={styles.metaRow}>
                <Bot size={13} color={colors.textSecondary} />
                <Text style={[styles.recentAi, { color: colors.textSecondary }]} numberOfLines={2}>
                  {log.aiRecommendation}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* NASA APOD */}
        <View style={[styles.apodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.sectionTitle}>
            <Rocket size={17} color={colors.text} />
            <Text style={[styles.sectionTitleText, { color: colors.text }]}>NASA — Imagem do Dia</Text>
          </View>
          {apodLoading ? (
            <>
              <Skeleton height={180} borderRadius={BorderRadius.md} style={{ marginVertical: Spacing.sm }} />
              <Skeleton height={16} width="80%" style={{ marginBottom: 8 }} />
              <Skeleton height={12} width="60%" />
            </>
          ) : apod ? (
            <>
              {apod.media_type === 'image' && !apodImageError && (
                <Image
                  source={{ uri: apod.url }}
                  style={styles.apodImage}
                  resizeMode="cover"
                  onError={() => setApodImageError(true)}
                />
              )}
              <Text style={[styles.apodTitle, { color: colors.text }]}>{apod.title}</Text>
              <Text style={[styles.apodDate, { color: colors.textMuted }]}>{apod.date}</Text>
              <Text style={[styles.apodDesc, { color: colors.textSecondary }]} numberOfLines={4}>
                {apod.explanation}
              </Text>
            </>
          ) : (
            <Text style={[styles.apodError, { color: colors.textMuted }]}>
              Não foi possível carregar. Verifique sua conexão.
            </Text>
          )}
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── StatCard ────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: IconComponent;
  colors: any;
}

function StatCard({ label, value, color, icon: Icon, colors }: StatCardProps) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: `${color}15`, borderColor: `${color}33` },
      ]}
    >
      <Icon size={18} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  greeting: { fontSize: FontSize.sm },
  brand: { fontSize: FontSize.xxl, fontWeight: '800', letterSpacing: -0.5 },
  statusDot: { width: 12, height: 12, borderRadius: 6 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { fontSize: FontSize.xl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, textAlign: 'center' },
  weatherCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  weatherRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weatherTemp: { fontSize: FontSize.xxxl, fontWeight: '800' },
  weatherDesc: { fontSize: FontSize.sm, textTransform: 'capitalize', marginTop: 2 },
  weatherCity: { fontSize: FontSize.xs },
  weatherDetails: { justifyContent: 'center', gap: 6 },
  weatherMeta: { fontSize: FontSize.sm },
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sectionTitleText: { fontSize: FontSize.lg, fontWeight: '700' },
  seeAll: { fontSize: FontSize.sm, fontWeight: '600' },
  recentCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: 6,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentName: { fontSize: FontSize.md, fontWeight: '700', flex: 1, marginRight: Spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recentMeta: { fontSize: FontSize.xs },
  recentAi: { fontSize: FontSize.sm, lineHeight: 18, flex: 1 },
  chartCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  apodCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  apodImage: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.sm,
  },
  apodTitle: { fontSize: FontSize.md, fontWeight: '700' },
  apodDate: { fontSize: FontSize.xs },
  apodDesc: { fontSize: FontSize.sm, lineHeight: 20 },
  apodError: { fontSize: FontSize.sm, textAlign: 'center', padding: Spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
