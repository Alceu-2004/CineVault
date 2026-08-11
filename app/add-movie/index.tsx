import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Movie } from "../../src/types/movie";
import imdbApi from "../../src/api/imdbApi";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme/colors";

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);

  async function loadMovies() {
    const data = await imdbApi.getPopularMovies();

    const mapped: Movie[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      rating: item.imDbRating || "N/A",
    }));

    setMovies(mapped);
  }

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/movie/${item.id}`)} activeOpacity={0.85}>
            <View style={styles.card}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
            </View>
          </TouchableOpacity>
        )}
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
  card: {
    marginBottom: spacing.md,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: radius.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 6,
  },
  rating: {
    color: colors.star,
    fontWeight: "600",
  },
});
