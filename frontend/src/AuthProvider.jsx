import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && res.data.role) {
          setUser({ token, ...res.data });
        } else {
          setUser(null);
          localStorage.removeItem("token");
        }
        setLoading(false);
      })
      .catch((err) => {
        setUser(null);
        localStorage.removeItem("token");
        setLoading(false);
      });
  }, [API_URL]);

  const login = (token) => {
    localStorage.setItem("token", token);
    axios
      .get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data && res.data.role) {
          setUser({ token, ...res.data });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
