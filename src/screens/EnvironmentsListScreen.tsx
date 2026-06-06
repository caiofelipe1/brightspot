import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ArrowUpDown, X } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EnvironmentsStackParamList, RiskLevel } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useEnvironments } from '../contexts/EnvironmentsContext';
import { EnvironmentCard } from '../components/EnvironmentCard';
import { CardSkeleton } from '../components/Skeleton';
import { BorderRadius, FontSize, Spacing } from '../theme';

type Props = NativeStackScreenProps<EnvironmentsStackParamList, 'EnvironmentsList'>;

type SortKey = 'newest' | 'oldest' | 'risk' | 'battery';
type FilterRisk = 'all' | RiskLevel;

const RISK_FILTERS: { label: string; value: FilterRisk }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Crítico', value: 'critical' },
  { label: 'Atenção', value: 'attention' },
  { label: 'Seguro', value: 'safe' },
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Mais recente', value: 'newest' },
  { label: 'Mais antigo', value: 'oldest' },
  { label: 'Risco', value: 'risk' },
  { label: 'Bateria', value: 'battery' },
];

const RISK_ORDER: Record<RiskLevel, number> = {
  critical: 0,
  attention: 1,
  safe: 2,
  unknown: 3,
};

export function EnvironmentsListScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const { logs, isLoading, removeLog } = useEnvironments();
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState<FilterRisk>('all');
  const [sortKey, setSortKey] = useState<SortKey>('newest');
  const [showSort, setShowSort] = useState(false);

  const filtered = useMemo(() => {
    let result = [...logs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q)
      );
    }

    if (filterRisk !== 'all') {
      result = result.filter((l) => l.riskLevel === filterRisk);
    }

    result.sort((a, b) => {
      switch (sortKey) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'risk':
          return RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel];
        case 'battery':
          return a.batteryLevel - b.batteryLevel;
        default:
          return 0;
      }
    });

    return result;
  }, [logs, search, filterRisk, sortKey]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Remover ambiente',
      `Deseja remover "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removeLog(id) },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Buscar ambiente..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.sortBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => setShowSort(!showSort)}
        >
          <ArrowUpDown size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={[styles.sortDropdown, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.sortOption,
                sortKey === opt.value && { backgroundColor: `${colors.primary}22` },
              ]}
              onPress={() => { setSortKey(opt.value); setShowSort(false); }}
            >
              <Text style={[styles.sortOptionText, { color: sortKey === opt.value ? colors.primary : colors.text }]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Risk filters */}
      <View style={styles.filtersRow}>
        {RISK_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[
              styles.filterChip,
              {
                backgroundColor: filterRisk === f.value ? colors.primary : colors.card,
                borderColor: filterRisk === f.value ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setFilterRisk(f.value)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterRisk === f.value ? colors.white : colors.textSecondary },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results count */}
      <Text style={[styles.countText, { color: colors.textMuted }]}>
        {filtered.length} ambiente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </Text>

      {/* List */}
      {isLoading ? (
        <View style={{ padding: Spacing.md }}>
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: Spacing.md }}>
              <EnvironmentCard
                log={item}
                onPress={() => navigation.navigate('EnvironmentDetail', { log: item })}
                onDelete={() => handleDelete(item.id, item.name)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Search size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                Nenhum ambiente encontrado
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xxl }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: FontSize.md },
  sortBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortDropdown: {
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  sortOption: { padding: Spacing.md },
  sortOptionText: { fontSize: FontSize.md, fontWeight: '600' },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  filterText: { fontSize: FontSize.sm, fontWeight: '600' },
  countText: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    fontSize: FontSize.sm,
  },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.md },
  emptyText: { fontSize: FontSize.md },
});
