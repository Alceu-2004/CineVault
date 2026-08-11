import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme/colors";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function isEmailValid(mail: string) {
    return /\S+@\S+\.\S+/.test(mail);
  }

  async function handleLogin() {
    if (!isEmailValid(email)) {
      Alert.alert("Erro", "Digite um email válido.");
      return;
    }

    if (senha.length < 3) {
      Alert.alert("Erro", "A senha deve ter ao menos 3 caracteres.");
      return;
    }

    const ok = await login(email, senha);

    if (!ok) {
      Alert.alert("Erro", "Email ou senha incorretos.");
      return;
    }

    router.replace("(drawer)/home");
  }

  return (
    <KeyboardAvoidingView
      style={styles.background}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Image source={require("../../assets/cinevault.png")} style={styles.image} />
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Entre para continuar sua jornada no cinema</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
            placeholderTextColor={colors.textMuted}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("(auth)/register")}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Criar conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: 180,
    height: 100,
    resizeMode: "contain",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: spacing.lg,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.textPrimary,
    padding: 14,
    marginBottom: spacing.md,
    borderRadius: radius.md,
    fontSize: 16,
    width: "100%",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: spacing.md,
    paddingVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
});
