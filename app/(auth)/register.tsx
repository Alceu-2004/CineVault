import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { router } from "expo-router";
import { colors, radius, spacing } from "../../src/theme/colors";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function isEmailValid(mail: string) {
    return /\S+@\S+\.\S+/.test(mail);
  }

  async function handleRegister() {
    if (!isEmailValid(email)) {
      Alert.alert("Erro", "Digite um email válido.");
      return;
    }

    if (senha.length < 3) {
      Alert.alert("Erro", "A senha deve ter ao menos 3 caracteres.");
      return;
    }

    const result = await register(email, senha);

    if (!result.success) {
      Alert.alert("Erro", result.error ?? "Não foi possível criar a conta.");
      return;
    }

    Alert.alert("Sucesso", "Registro realizado com sucesso!", [
      {
        text: "OK",
        onPress: () => router.replace("(drawer)/home"),
      },
    ]);
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
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Comece a montar seu acervo de filmes</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••"
              secureTextEntry
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("(auth)/login")}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Voltar ao login</Text>
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
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  image: {
    width: 160,
    height: 90,
    resizeMode: "contain",
    marginBottom: spacing.md,
    alignSelf: "center",
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: spacing.lg,
    color: colors.textSecondary,
  },
  inputContainer: {
    width: "100%",
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.textPrimary,
    padding: 14,
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
