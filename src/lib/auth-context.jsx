import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out
  const [error, setError] = useState("");

  async function refresh() {
    try {
      const { user } = await api.get("/auth?action=me");
      setUser(user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function login(email, password) {
    setError("");
    try {
      const { user } = await api.post("/auth?action=login", { email, password });
      setUser(user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  async function logout() {
    await api.post("/auth?action=logout");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, error, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
