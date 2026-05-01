import React, { createContext, useEffect, useState } from "react";
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  saveToken,
  saveUser,
} from "../utils/storage";

type UserType = {
  _id: string;
  full_name: string;
  phone: string;
  role: "admin" | "employee" | "user";
  username: string;
  address: string;
};

type AuthContextType = {
  token: string | null;
  user: UserType | null;
  loading: boolean;
  login: (token: string, user: UserType) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (newToken: string, newUser: UserType) => {
    setToken(newToken);
    setUser(newUser);
    await saveToken(newToken);
    await saveUser(newUser);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await removeToken();
    await removeUser();
  };

  const loadAuthData = async () => {
    const storedToken = await getToken();
    const storedUser = await getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadAuthData();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};