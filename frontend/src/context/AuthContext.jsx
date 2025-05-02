// src/context/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import apiClient from "../utils/apiClient";         // ← your axios instance

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  // 1️⃣  Boot-strap the user from the cookie
  useEffect(() => {
    apiClient
      .get('/auth/me')          // ← hits GET /api/auth/me
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))   // token missing/invalid
      .finally(() => setLoading(false));
  }, []);


  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
