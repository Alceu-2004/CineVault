// Paleta centralizada do CineVault — tema escuro cinematográfico.
// Importe este arquivo em qualquer tela para manter consistência visual.

export const colors = {
  // Fundos
  background: "#0D0F17",     // fundo principal, quase preto com leve tom azulado
  surface: "#171A24",        // cards, containers elevados
  surfaceAlt: "#1E212D",     // inputs, elementos secundários
  overlay: "rgba(6, 7, 12, 0.75)", // fundo de modais

  // Bordas e divisores
  border: "#2A2E3B",
  borderLight: "#363B4A",

  // Marca / destaque (dourado cinema, mantém identidade original)
  primary: "#D8AE82",
  primaryDark: "#B8895B",
  primaryMuted: "rgba(216, 174, 130, 0.15)",

  // Texto
  textPrimary: "#F5F5F7",
  textSecondary: "#A6ACBB",
  textMuted: "#6B7280",
  textOnPrimary: "#171A24",

  // Estados / feedback
  success: "#4ADE80",
  successDark: "#1F8A4C",
  danger: "#F87171",
  dangerDark: "#B3261E",
  info: "#60A5FA",
  infoDark: "#1D4ED8",

  // Estrelas / avaliação
  star: "#F5C451",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
};

export default colors;
