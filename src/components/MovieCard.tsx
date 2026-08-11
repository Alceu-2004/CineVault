import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Movie } from "../types/movie";
import { colors, radius, spacing } from "../theme/colors";

interface WatchedMovie {
  id: string;
  title: string;
  image: string;
  year: string;
  rating: string;
  userRating: number;
}

export default function MovieCard({ movie }: { movie: WatchedMovie | any }) {
  const openDetails = () => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id },
    });
  };

  const hasUserRating = movie.userRating !== undefined && movie.userRating > 0;

  return (
    <Pressable
      onPress={openDetails}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image
        source={{ uri: movie.image }}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>

        {movie.year && <Text style={styles.yearText}>Ano: {movie.year}</Text>}

        {movie.rating && <Text style={styles.ratingText}>⭐ Nota Geral: {movie.rating}</Text>}

        {hasUserRating && (
          <Text style={styles.userRatingText}>
            ✍️ Sua Nota: {movie.userRating.toFixed(1)}/10
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  image: {
    width: 72,
    height: 104,
    marginRight: spacing.md,
    borderRadius: radius.sm,
    resizeMode: "cover",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  yearText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ratingText: {
    fontSize: 14,
    color: colors.star,
    fontWeight: "500",
  },
  userRatingText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.success,
    marginTop: 4,
  },
});
