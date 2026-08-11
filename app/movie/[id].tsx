import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import imdbApi from "../../src/api/imdbApi";
import { Movie } from "../../src/types/movie";
import { useMovies } from "../../src/contexts/MoviesContext";
import { colors, spacing } from "../../src/theme/colors";

export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const { watchedMovies, wantToWatchMovies } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loadError, setLoadError] = useState(false);

  async function loadMovieDetails() {
    setLoadError(false);

    // Se o filme já está em uma das listas do usuário, usa os dados salvos
    // localmente em vez de chamar a API de novo.
    const watched = watchedMovies.find((m) => m.id === String(id));
    if (watched) {
      setMovie(watched);
      setUserRating(watched.userRating);
      return;
    }

    const wantToWatch = wantToWatchMovies.find((m) => m.id === String(id));
    if (wantToWatch) {
      setMovie(wantToWatch);
      setUserRating(null);
      return;
    }

    // Caso contrário (ex: veio da lista de populares na Home), busca na API.
    try {
      const data = await imdbApi.getDetails(String(id));

      const mapped: Movie = {
        id: data.id,
        title: data.title,
        image: data.image,
        rating: data.rating,
        plot: data.plot,
      };

      setMovie(mapped);
      setUserRating(null);
    } catch (error) {
      console.log("Erro ao buscar detalhes do filme:", error);
      setLoadError(true);
    }
  }

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  if (loadError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Não foi possível carregar os detalhes deste filme.</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image
        source={{ uri: movie.image }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.rating}>⭐ {movie.rating}</Text>
        {userRating !== null && userRating > 0 && (
          <Text style={styles.userRating}>✍️ Sua nota: {userRating.toFixed(1)}/10</Text>
        )}
        <Text style={styles.plot}>{movie.plot}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 420,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  rating: {
    fontSize: 17,
    color: colors.star,
    fontWeight: "600",
    marginBottom: 4,
  },
  userRating: {
    fontSize: 16,
    color: colors.success,
    fontWeight: "700",
    marginBottom: 16,
  },
  plot: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
