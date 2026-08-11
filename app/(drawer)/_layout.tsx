import React from "react";
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { useAuth } from "../../src/contexts/AuthContext";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { colors } from "../../src/theme/colors";

function CustomDrawerContent(props) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView {...props} style={{ backgroundColor: colors.surface }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.logoutSection}>
        <DrawerItem
          label="Sair"
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color={colors.danger} />
          )}
          onPress={handleLogout}
          labelStyle={{ color: colors.danger, fontWeight: 'bold', marginLeft: 0 }}
        />
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const { logout } = useAuth();

  const handleLogoutHeader = async () => {
    await logout();
  };

  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { color: colors.textPrimary, fontWeight: '700' },
        drawerStyle: { backgroundColor: colors.surface },
        drawerActiveBackgroundColor: colors.primaryMuted,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: { marginLeft: 0 },

        headerRight: () => (
          <TouchableOpacity onPress={handleLogoutHeader} style={{ marginRight: 16 }}>
            <Text style={{ color: colors.danger, fontWeight: '700' }}>Sair</Text>
          </TouchableOpacity>
        ),
      }}
      initialRouteName="home"
    >

      <Drawer.Screen
        name="home"
        options={{
          title: "Início",
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
          headerRight: undefined,
        }}
      />

      <Drawer.Screen
        name="about"
        options={{
          title: "Sobre",
          drawerIcon: ({ color }) => (
            <Ionicons name="information-circle-outline" size={24} color={color} />
          ),
          headerRight: undefined,
        }}
      />

      <Drawer.Screen
        name="assistidos"
        options={{
          title: "Assistidos",
          drawerIcon: ({ color }) => (
            <Ionicons name="checkmark-circle-outline" size={24} color={color} />
          ),
          headerRight: undefined,
        }}
      />

      <Drawer.Screen
        name="quero-assistir"
        options={{
          title: "Quero Assistir",
          drawerIcon: ({ color }) => (
            <Ionicons name="bookmark-outline" size={24} color={color} />
          ),
          headerRight: undefined,
        }}
      />

      <Drawer.Screen
        name="add-movie/index"
        options={{
          title: "Adicionar Filme",
          drawerItemStyle: { height: 0, overflow: 'hidden' },
        }}
      />

      <Drawer.Screen
        name="movie/[id]"
        options={{
          title: "Detalhes do Filme",
          drawerItemStyle: { height: 0, overflow: 'hidden' },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  logoutSection: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  }
});
