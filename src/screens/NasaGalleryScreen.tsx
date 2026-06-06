import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Telescope, Camera, X, Globe, CheckCircle2, XCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMarsPhotos } from '../hooks/useNasa';
import { MarsPhoto } from '../types';
import { Skeleton } from '../components/Skeleton';
import { BorderRadius, FontSize, Spacing } from '../theme';

export function NasaGalleryScreen() {
  const { colors } = useTheme();
  const { photos, isLoading, error } = useMarsPhotos(1000);
  const [selected, setSelected] = useState<MarsPhoto | null>(null);

  const renderPhoto = ({ item }: { item: MarsPhoto }) => (
    <TouchableOpacity
      style={[styles.photoCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => setSelected(item)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.img_src }} style={styles.photo} resizeMode="cover" />
      <View style={styles.photoInfo}>
        <View style={styles.infoRow}>
          <Camera size={11} color={colors.text} />
          <Text style={[styles.photoCamera, { color: colors.text }]} numberOfLines={1}>
            {item.camera.full_name}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Globe size={11} color={colors.textMuted} />
          <Text style={[styles.photoMeta, { color: colors.textMuted }]}>
            {item.rover.name} · {item.earth_date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Telescope size={22} color={colors.text} />
          <Text style={[styles.title, { color: colors.text }]}>Galeria de Marte</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Fotos reais do rover Curiosity — Sol 1000
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              height={140}
              width="48%"
              borderRadius={BorderRadius.md}
              style={{ marginBottom: Spacing.sm }}
            />
          ))}
        </View>
      ) : error || photos.length === 0 ? (
        <View style={styles.error}>
          <Telescope size={48} color={colors.textMuted} />
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            {error ?? 'Nenhuma foto disponível. Verifique sua conexão.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPhoto}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ padding: Spacing.md, paddingBottom: Spacing.xxl }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Detail Modal */}
      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
            <X size={18} color={colors.primary} />
            <Text style={[styles.closeText, { color: colors.primary }]}>Fechar</Text>
          </TouchableOpacity>
          {selected && (
            <ScrollView>
              <Image
                source={{ uri: selected.img_src }}
                style={styles.modalImage}
                resizeMode="contain"
              />
              <View style={styles.modalInfo}>
                <View style={styles.infoRow}>
                  <Globe size={18} color={colors.text} />
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {selected.rover.name} — {selected.camera.full_name}
                  </Text>
                </View>
                <Text style={[styles.modalMeta, { color: colors.textSecondary }]}>
                  Data terrestre: {selected.earth_date}
                </Text>
                <Text style={[styles.modalMeta, { color: colors.textSecondary }]}>
                  Foto #{selected.id}
                </Text>
                <View style={[styles.roverCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.roverLabel, { color: colors.textMuted }]}>Status do Rover</Text>
                  <View style={styles.infoRow}>
                    {selected.rover.status === 'active' ? (
                      <CheckCircle2 size={15} color={colors.success} />
                    ) : (
                      <XCircle size={15} color={colors.textSecondary} />
                    )}
                    <Text style={[
                      styles.roverStatus,
                      { color: selected.rover.status === 'active' ? colors.success : colors.textSecondary },
                    ]}>
                      {selected.rover.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: Spacing.md, gap: 4 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  title: { fontSize: FontSize.xxl, fontWeight: '800' },
  subtitle: { fontSize: FontSize.sm },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.md,
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  row: { justifyContent: 'space-between', marginBottom: Spacing.sm },
  photoCard: {
    width: '48%',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  photo: { width: '100%', height: 120 },
  photoInfo: { padding: Spacing.sm, gap: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  photoCamera: { fontSize: FontSize.xs, fontWeight: '600', flex: 1 },
  photoMeta: { fontSize: FontSize.xs, flex: 1 },
  error: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  errorText: { fontSize: FontSize.md, textAlign: 'center' },
  modal: { flex: 1 },
  closeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: Spacing.md },
  closeText: { fontSize: FontSize.md, fontWeight: '600' },
  modalImage: { width: '100%', height: 300 },
  modalInfo: { padding: Spacing.md, gap: Spacing.sm },
  modalTitle: { fontSize: FontSize.lg, fontWeight: '700', flex: 1 },
  modalMeta: { fontSize: FontSize.md },
  roverCard: {
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roverLabel: { fontSize: FontSize.sm },
  roverStatus: { fontSize: FontSize.sm, fontWeight: '700' },
});
