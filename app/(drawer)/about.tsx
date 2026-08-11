import { View, Text, Image, StyleSheet } from "react-native";
import { colors, radius, spacing } from "../../src/theme/colors";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/cinevault.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Sobre o CineVault</Text>
      <Text style={styles.text}>
        CineVault é um aplicativo para explorar filmes, montar suas listas de
        assistidos e "quero assistir", e avaliar suas próprias experiências
        no cinema.
      </Text>
      <Text style={styles.textSecondary}>
        Desenvolvido como projeto de portfólio, com React Native e Expo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.background,
    alignItems: "center",
    paddingTop: spacing.xl,
  },
  logo: {
    width: 160,
    height: 90,
    resizeMode: "contain",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
});
