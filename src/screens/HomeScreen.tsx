import React from 'react';
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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useEnvironments } from '../contexts/EnvironmentsContext';
import { useApod } from '../hooks/useNasa';
import { useWeather } from '../hooks/useWeather';
import { RiskBadge } from '../components/RiskBadge';
import { Skeleton } from '../components/Skeleton';
import { formatTimestamp, getRiskColor } from '../utils';
import { BorderRadius, FontSize, Spacing } from '../theme';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { logs } = useEnvironments();
  const { apod, isLoading: apodLoading } = useApod();
  const { weather } = useWeather();
  const [refreshing, setRefreshing] = React.useState(false);

  const criticalCount = logs.filter((l) => l.riskLevel === 'critical').length;
  const attentionCount = logs.filter((l) => l.riskLevel === 'attention').length;
  const safeCount = logs.filter((l) => l.riskLevel === 'safe').length;
  const recentLogs = logs.slice(0, 3);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
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
          <StatCard
            label="Críticos"
            value={criticalCount}
            color={colors.danger}
            emoji="🚨"
            colors={colors}
          />
          <StatCard
            label="Atenção"
            value={attentionCount}
            color={colors.warning}
            emoji="⚠️"
            colors={colors}
          />
          <StatCard
            label="Seguros"
            value={safeCount}
            color={colors.success}
            emoji="✅"
            colors={colors}
          />
          <StatCard
            label="Total"
            value={logs.length}
            color={colors.primary}
            emoji="📡"
            colors={colors}
          />
        </View>

        {/* Weather card */}
        {weather && (
          <View style={[styles.weatherCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              🌍 Condições Externas
            </Text>
            <View style={styles.weatherRow}>
              <View>
                <Text style={[styles.weatherTemp, { color: colors.primary }]}>
                  {Math.round(weather.main.temp)}°C
                </Text>
                <Text style={[styles.weatherDesc, { color: colors.textSecondary }]}>
                  {weather.weather[0].description}
                </Text>
                <Text style={[styles.weatherCity, { color: colors.textMuted }]}>
                  📍 {weather.name}, {weather.sys.country}
                </Text>
              </View>
              <View style={styles.weatherDetails}>
                <Text style={[styles.weatherMeta, { color: colors.textSecondary }]}>
                  💧 Umidade: {weather.main.humidity}%
                </Text>
                <Text style={[styles.weatherMeta, { color: colors.textSecondary }]}>
                  💨 Vento: {weather.wind.speed} m/s
                </Text>
                <Text style={[styles.weatherMeta, { color: colors.textSecondary }]}>
                  🌡️ Sensação: {Math.round(weather.main.feels_like)}°C
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Recent environments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              📡 Leituras Recentes
            </Text>
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
              <Text style={[styles.recentMeta, { color: colors.textMuted }]}>
                📍 {log.location} · 🕐 {formatTimestamp(log.timestamp)}
              </Text>
              <Text style={[styles.recentAi, { color: colors.textSecondary }]} numberOfLines={2}>
                🤖 {log.aiRecommendation}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* NASA APOD */}
        <View style={[styles.apodCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🚀 NASA — Imagem do Dia
          </Text>
          {apodLoading ? (
            <>
              <Skeleton height={180} borderRadius={BorderRadius.md} style={{ marginVertical: Spacing.sm }} />
              <Skeleton height={16} width="80%" style={{ marginBottom: 8 }} />
              <Skeleton height={12} width="60%" />
            </>
          ) : apod ? (
            <>
              {apod.media_type === 'image' && (
                <Image
                  source={{ uri: apod.url }}
                  style={styles.apodImage}
                  resizeMode="cover"
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
  emoji: string;
  colors: any;
}

function StatCard({ label, value, color, emoji, colors }: StatCardProps) {
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: `${color}15`, borderColor: `${color}33` },
      ]}
    >
      <Text style={styles.statEmoji}>{emoji}</Text>
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
  },
  statEmoji: { fontSize: 18, marginBottom: 2 },
  statValue: { fontSize: FontSize.xl, fontWeight: '800' },
  statLabel: { fontSize: FontSize.xs, textAlign: 'center' },
  weatherCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
  },
  weatherRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  weatherTemp: { fontSize: FontSize.xxxl, fontWeight: '800' },
  weatherDesc: { fontSize: FontSize.sm, textTransform: 'capitalize' },
  weatherCity: { fontSize: FontSize.xs, marginTop: 4 },
  weatherDetails: { justifyContent: 'center', gap: 6 },
  weatherMeta: { fontSize: FontSize.sm },
  section: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700' },
  seeAll: { fontSize: FontSize.sm, fontWeight: '600' },
  recentCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentName: { fontSize: FontSize.md, fontWeight: '700', flex: 1, marginRight: Spacing.sm },
  recentMeta: { fontSize: FontSize.xs, marginBottom: 6 },
  recentAi: { fontSize: FontSize.sm, lineHeight: 18 },
  apodCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
  },
  apodImage: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.sm,
  },
  apodTitle: { fontSize: FontSize.md, fontWeight: '700', marginBottom: 4 },
  apodDate: { fontSize: FontSize.xs, marginBottom: Spacing.sm },
  apodDesc: { fontSize: FontSize.sm, lineHeight: 20 },
  apodError: { fontSize: FontSize.sm, textAlign: 'center', padding: Spacing.md },
});
