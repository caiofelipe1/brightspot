import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useEnvironments } from '../contexts/EnvironmentsContext';
import { storage, STORAGE_KEYS } from '../storage';
import { BorderRadius, FontSize, Spacing } from '../theme';

export function SettingsScreen() {
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const { logs, favorites } = useEnvironments();

  const handleClearData = () => {
    Alert.alert(
      'Limpar dados',
      'Isso removerá todos os ambientes salvos. Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await storage.remove(STORAGE_KEYS.LOGS);
            Alert.alert('Dados removidos', 'Reinicie o app para aplicar.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>⚙️ Configurações</Text>
        </View>

        {/* Appearance */}
        <SectionHeader label="Aparência" colors={colors} />

        <SettingRow colors={colors}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Modo escuro</Text>
          <Switch
            value={isDark}
            onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </SettingRow>

        <View style={[styles.themeRow, { borderColor: colors.border }]}>
          {(['dark', 'light', 'system'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.themeBtn,
                {
                  backgroundColor: themeMode === mode ? colors.primary : colors.card,
                  borderColor: themeMode === mode ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setThemeMode(mode)}
            >
              <Text style={[
                styles.themeBtnText,
                { color: themeMode === mode ? colors.white : colors.textSecondary },
              ]}>
                {mode === 'dark' ? '🌙 Escuro' : mode === 'light' ? '☀️ Claro' : '📱 Sistema'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <SectionHeader label="Estatísticas" colors={colors} />

        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <StatRow label="Total de ambientes" value={logs.length} colors={colors} />
          <StatRow label="Favoritos" value={favorites.length} colors={colors} />
          <StatRow
            label="Críticos"
            value={logs.filter((l) => l.riskLevel === 'critical').length}
            colors={colors}
            valueColor={colors.danger}
          />
          <StatRow
            label="Em atenção"
            value={logs.filter((l) => l.riskLevel === 'attention').length}
            colors={colors}
            valueColor={colors.warning}
          />
          <StatRow
            label="Seguros"
            value={logs.filter((l) => l.riskLevel === 'safe').length}
            colors={colors}
            valueColor={colors.success}
          />
        </View>

        {/* Data */}
        <SectionHeader label="Dados" colors={colors} />

        <TouchableOpacity
          style={[styles.dangerBtn, { borderColor: colors.danger }]}
          onPress={handleClearData}
        >
          <Text style={[styles.dangerText, { color: colors.danger }]}>
            🗑️ Limpar todos os dados
          </Text>
        </TouchableOpacity>

        {/* About */}
        <SectionHeader label="Sobre" colors={colors} />

        <View style={[styles.aboutCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.aboutTitle, { color: colors.text }]}>🛰️ BrightSpot</Text>
          <Text style={[styles.aboutVersion, { color: colors.textMuted }]}>v1.0.0 · Global Solution 2026</Text>
          <Text style={[styles.aboutDesc, { color: colors.textSecondary }]}>
            Sistema de Inteligência Ambiental para exploração de ambientes remotos e de difícil acesso.
          </Text>
          <Text style={[styles.aboutOds, { color: colors.primary }]}>
            ODS 9 · ODS 11 · ODS 13
          </Text>
        </View>

        {/* API Info */}
        <View style={[styles.apiCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          <Text style={[styles.apiTitle, { color: colors.text }]}>🔑 APIs Integradas</Text>
          <Text style={[styles.apiItem, { color: colors.textSecondary }]}>
            🚀 NASA APOD — Imagem Astronômica do Dia
          </Text>
          <Text style={[styles.apiItem, { color: colors.textSecondary }]}>
            🔭 NASA Mars Rover — Fotos de Marte
          </Text>
          <Text style={[styles.apiItem, { color: colors.textSecondary }]}>
            🌍 OpenWeatherMap — Dados Climáticos
          </Text>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ label, colors }: { label: string; colors: any }) {
  return (
    <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{label.toUpperCase()}</Text>
  );
}

function SettingRow({ children, colors }: { children: React.ReactNode; colors: any }) {
  return (
    <View style={[styles.settingRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {children}
    </View>
  );
}

function StatRow({
  label,
  value,
  colors,
  valueColor,
}: {
  label: string;
  value: number;
  colors: any;
  valueColor?: string;
}) {
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color: valueColor ?? colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  settingLabel: { fontSize: FontSize.md },
  themeRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  themeBtn: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  themeBtnText: { fontSize: FontSize.sm, fontWeight: '600' },
  statsCard: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statLabel: { fontSize: FontSize.md },
  statValue: { fontSize: FontSize.md, fontWeight: '700' },
  dangerBtn: {
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dangerText: { fontSize: FontSize.md, fontWeight: '600' },
  aboutCard: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  aboutTitle: { fontSize: FontSize.xl, fontWeight: '800', marginBottom: 4 },
  aboutVersion: { fontSize: FontSize.xs, marginBottom: Spacing.sm },
  aboutDesc: { fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.sm },
  aboutOds: { fontSize: FontSize.sm, fontWeight: '700' },
  apiCard: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  apiTitle: { fontSize: FontSize.md, fontWeight: '700', marginBottom: Spacing.xs },
  apiItem: { fontSize: FontSize.sm },
});
