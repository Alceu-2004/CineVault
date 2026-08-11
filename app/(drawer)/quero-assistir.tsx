import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useMovies } from "../../src/contexts/MoviesContext";
import MovieCard from "../../src/components/MovieCard";
import { Movie } from "../../src/types/movie";
import { colors, radius, spacing } from "../../src/theme/colors";

interface RatingModalProps {
  isVisible: boolean;
  onClose: () => void;
  movieToRate: Movie | null;
  onConfirmMove: (movie: Movie, rating: number) => void;
}

const RatingModal = ({ isVisible, onClose, movieToRate, onConfirmMove }: RatingModalProps) => {
  const [userRating, setUserRating] = useState('');

  if (!movieToRate) return null;

  const handleConfirm = () => {
    const rating = parseFloat(userRating.replace(',', '.'));
    if (isNaN(rating) || rating < 0 || rating > 10) {
      Alert.alert('Avaliação Inválida', 'Por favor, insira uma nota válida de 0 a 10.');
      return;
    }
    onConfirmMove(movieToRate, rating);
    setUserRating('');
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <Text style={modalStyles.modalTitle}>Avaliar e Mover Filme</Text>
          <Text style={modalStyles.movieTitle} numberOfLines={2}>{movieToRate.title}</Text>

          <Text style={modalStyles.ratingLabel}>Sua Nota (0-10):</Text>
          <TextInput
            style={modalStyles.ratingInput}
            keyboardType="numeric"
            maxLength={4}
            value={userRating}
            onChangeText={(text) => setUserRating(text.replace(/[^0-9.,]/g, '').substring(0, 4))}
            placeholder="Ex: 8.5"
            placeholderTextColor={colors.textMuted}
          />

          <View style={modalStyles.buttonRow}>
            <TouchableOpacity style={modalStyles.cancelButton} onPress={() => { setUserRating(''); onClose(); }} activeOpacity={0.8}>
              <Text style={modalStyles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.confirmButton} onPress={handleConfirm} activeOpacity={0.85}>
              <Text style={modalStyles.confirmButtonText}>Mover para Assistidos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function QueroAssistirScreen() {
  const { wantToWatchMovies, isLoading, removeWantToWatchMovie, moveFromWantToWatchToWatched } = useMovies();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleConfirmMove = async (movie: Movie, rating: number) => {
    try {
      await moveFromWantToWatchToWatched(movie.id, movie, rating);
      Alert.alert('Sucesso', `${movie.title} movido para Assistidos com nota ${rating}!`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível mover o filme.');
    }
  };

  const handleMoveToWatched = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalVisible(true);
  };

  const handleRemove = (movieTitle: string, movieId: string) => {
    Alert.alert(
      "Confirmar Remoção",
      `Tem certeza que deseja remover "${movieTitle}" da sua lista Quero Assistir?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => removeWantToWatchMovie(movieId), style: "destructive" }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quero Assistir</Text>
      <Text style={styles.count}>{wantToWatchMovies.length} filme(s)</Text>

      {wantToWatchMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Sua lista Quero Assistir está vazia.</Text>
          <Text style={styles.emptySubtext}>
            Adicione filmes que você quer assistir na página inicial
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/(drawer)/home")}
            activeOpacity={0.85}
          >
            <Text style={styles.addButtonText}>Adicionar Filme na Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wantToWatchMovies.slice().reverse()}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <MovieCard movie={item} />

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.watchedButton}
                  onPress={() => handleMoveToWatched(item)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionButtonText}>✓ Já Assisti</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(item.title, item.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <RatingModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        movieToRate={selectedMovie}
        onConfirmMove={handleConfirmMove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
  },
  count: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 50,
  },
  cardContainer: {
    marginBottom: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  watchedButton: {
    flex: 1,
    backgroundColor: colors.successDark,
    padding: 10,
    borderRadius: radius.sm,
    marginRight: 5,
  },
  removeButton: {
    flex: 1,
    backgroundColor: colors.dangerDark,
    padding: 10,
    borderRadius: radius.sm,
    marginLeft: 5,
  },
  actionButtonText: {
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: spacing.md,
  },
  emptyText: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radius.sm,
    marginTop: 16,
  },
  addButtonText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    fontSize: 15,
  }
});

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  movieTitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: colors.textSecondary,
  },
  ratingLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: colors.textPrimary,
    alignSelf: 'flex-start',
  },
  ratingInput: {
    height: 44,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    backgroundColor: colors.surfaceAlt,
    color: colors.textPrimary,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: colors.success,
    borderRadius: radius.sm,
    padding: 12,
    flex: 1,
    marginLeft: 5,
  },
  confirmButtonText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 12,
    flex: 1,
    marginRight: 5,
  },
  cancelButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
});
