import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  user: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type UsersMap = Record<string, string>; // email -> senha

async function getUsers(): Promise<UsersMap> {
  const stored = await AsyncStorage.getItem("users");
  if (stored) {
    return JSON.parse(stored);
  }

  // Migração: se existir uma conta única no formato antigo (versões anteriores
  // do app só suportavam 1 usuário por dispositivo), converte para o novo formato
  // sem apagar a conta que a pessoa já tinha criado.
  const legacy = await AsyncStorage.getItem("credentials");
  if (legacy) {
    const { email, password } = JSON.parse(legacy);
    const migrated: UsersMap = { [email]: password };
    await AsyncStorage.setItem("users", JSON.stringify(migrated));
    return migrated;
  }

  return {};
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const stored = await AsyncStorage.getItem("user");
      if (stored) {
        setUser(stored);
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getUsers();

    if (users[normalizedEmail]) {
      return { success: false, error: "Já existe uma conta cadastrada com este e-mail." };
    }

    users[normalizedEmail] = password;
    await AsyncStorage.setItem("users", JSON.stringify(users));
    await AsyncStorage.setItem("user", normalizedEmail);
    setUser(normalizedEmail);
    return { success: true };
  }

  async function login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await getUsers();

    if (users[normalizedEmail] && users[normalizedEmail] === password) {
      await AsyncStorage.setItem("user", normalizedEmail);
      setUser(normalizedEmail);
      return true;
    }

    return false;
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.error("Erro ao remover item do AsyncStorage:", e);
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
