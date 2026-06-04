import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useEnvironments } from '../contexts/EnvironmentsContext';
import { EnvironmentCard } from '../components/EnvironmentCard';
import { CardSkeleton } from '../components/Skeleton';
import { FontSize, Spacing } from '../theme';

export function FavoritesScreen() {
  const { colors } = useTheme();
  const { favorites, isLoading } = useEnvironments();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>⭐ Favoritos</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {favorites.length} ambiente{favorites.length !== 1 ? 's' : ''} salvo{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {isLoading ? (
        <View style={{ padding: Spacing.md }}>
          {[1, 2].map((i) => <CardSkeleton key={i} />)}
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ paddingHorizontal: Spacing.md }}>
              <EnvironmentCard
                log={item}
                onPress={() =>
                  navigation.navigate('Home', {
                    screen: 'EnvironmentDetail',
                    params: { log: item },
                  })
                }
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>⭐</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Nenhum favorito ainda
              </Text>
              <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
                Toque na estrela (☆) em qualquer ambiente para salvar aqui.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xxl, flexGrow: 1 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  subtitle: { fontSize: FontSize.sm, marginTop: 2 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl * 2,
  },
  emptyEmoji: { fontSize: 56, marginBottom: Spacing.md },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: Spacing.sm },
  emptyDesc: { fontSize: FontSize.md, textAlign: 'center', lineHeight: 22 },
});
