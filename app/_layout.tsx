import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { AuthProvider, useAuth } from "../src/contexts/AuthContext";
import { MoviesProvider } from "../src/contexts/MoviesContext";
import { colors } from "../src/theme/colors";

function RootLayoutNav() {
  const { user } = useAuth();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        {user ? (
          <Stack.Screen name="(drawer)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
        <Stack.Screen
          name="movie/[id]"
          options={{
            headerShown: true,
            headerTitle: "",
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.textPrimary,
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <RootLayoutNav />
      </MoviesProvider>
    </AuthProvider>
  );
}