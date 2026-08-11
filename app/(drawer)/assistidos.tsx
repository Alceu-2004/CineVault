import { View, Text, StyleSheet, FlatList } from "react-native";
import { useMovies } from "../../src/contexts/MoviesContext";
import MovieCard from "../../src/components/MovieCard";
import { colors, spacing } from "../../src/theme/colors";

export default function AssistidosScreen() {
  const { watchedMovies, isLoading } = useMovies();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (watchedMovies.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhum filme assistido ainda</Text>
        <Text style={styles.emptySubtext}>
          Marque filmes como assistidos na página inicial
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmes Assistidos</Text>
      <Text style={styles.count}>{watchedMovies.length} filme(s)</Text>
      <FlatList
        data={watchedMovies.slice().reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MovieCard movie={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: "center",
  },
  count: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: "center",
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
  emptyText: {
    fontSize: 19,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    marginTop: 50,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
  },
});
