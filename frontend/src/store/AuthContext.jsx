import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // We need a loading state so the app doesn't flash before checking your token
  const [loading, setLoading] = useState(true);

  // When the app first loads, check if we already have a token saved
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Hits the secure endpoint we built in Django to get your user info
  const fetchUserProfile = async () => {
    try {
      const response = await api.get("users/profile/");
      setUser(response.data);
      setIsAdmin(response.data.isAdmin); // This reads the is_staff flag from Django!
    } catch (error) {
      console.error("Invalid token or session expired", error);
      logout(); // If the token is fake or expired, kick them out
    } finally {
      setLoading(false);
    }
  };

  // Inside AuthContext.jsx
  const login = async (email, password) => {
    try {
      const response = await api.post("users/login/", {
        username: email,
        password: password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      // Capture the profile data to return it to the login page
      const profileResponse = await api.get("users/profile/");
      setUser(profileResponse.data);
      setIsAdmin(profileResponse.data.isAdmin);

      return {
        success: true,
        isAdmin: profileResponse.data.isAdmin, // Pass it back directly
      };
    } catch (error) {
      return { success: false, error: "Invalid credentials" };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
