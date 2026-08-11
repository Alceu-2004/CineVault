import { useState } from "react";
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { colors, radius, spacing } from "../theme/colors";

interface RatingPromptModalProps {
  isVisible: boolean;
  movieTitle: string;
  onCancel: () => void;
  onConfirm: (rating: number) => void;
  confirmLabel?: string;
}

export default function RatingPromptModal({
  isVisible,
  movieTitle,
  onCancel,
  onConfirm,
  confirmLabel = "Confirmar",
}: RatingPromptModalProps) {
  const [rating, setRating] = useState("");

  const handleConfirm = () => {
    const parsed = parseFloat(rating.replace(",", "."));
    if (isNaN(parsed) || parsed < 0 || parsed > 10) {
      Alert.alert("Avaliação Inválida", "Por favor, insira uma nota válida de 0 a 10.");
      return;
    }
    onConfirm(parsed);
    setRating("");
  };

  const handleCancel = () => {
    setRating("");
    onCancel();
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent onRequestClose={handleCancel}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Avaliar Filme</Text>
          <Text style={styles.movieTitle} numberOfLines={2}>{movieTitle}</Text>

          <Text style={styles.label}>Sua Nota (0-10):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={4}
            value={rating}
            onChangeText={(text) => setRating(text.replace(/[^0-9.,]/g, "").substring(0, 4))}
            placeholder="Ex: 8.5"
            placeholderTextColor={colors.textMuted}
            autoFocus
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} activeOpacity={0.85}>
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlay,
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    width: "85%",
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 10,
    color: colors.textPrimary,
  },
  movieTitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "700",
    color: colors.textSecondary,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: colors.textPrimary,
    alignSelf: "flex-start",
  },
  input: {
    height: 44,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    backgroundColor: colors.surfaceAlt,
    color: colors.textPrimary,
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
    fontWeight: "700",
    textAlign: "center",
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
    fontWeight: "700",
    textAlign: "center",
  },
});
