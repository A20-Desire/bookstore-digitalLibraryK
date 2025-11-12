import React, { createContext, useContext, useMemo, useState } from "react";

const AUTH_STORAGE_KEY = "digitalLibraryAuth";

const getInitialState = () => {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { token: null, user: null };
  } catch (error) {
    console.error("Failed to parse auth state", error);
    return { token: null, user: null };
  }
};

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialState);

  const persistState = (nextState) => {
    setAuthState(nextState);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
  };

  const login = ({ token, user }) => {
    if (!token || !user) return;
    persistState({ token, user });
  };

  const logout = () => {
    persistState({ token: null, user: null });
  };

  const updateUser = (partialUser) => {
    persistState({ token: authState.token, user: { ...authState.user, ...partialUser } });
  };

  const value = useMemo(
    () => ({
      token: authState.token,
      user: authState.user,
      isAuthenticated: Boolean(authState.token),
      login,
      logout,
      updateUser,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
