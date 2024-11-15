import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../../src/Hook/useAxios";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../../../Utils";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await useAxios.post("/users/login", { email, password });
      const { accessToken, refreshToken, user: userData } = result.data;
      localStorage.setItem("userId", userData._id);

      setUser(userData);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      return userData.role;
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await useAxios.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data.user);
      console.log("User data:", data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      removeAccessToken();
      removeRefreshToken();
      localStorage.removeItem("userId");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Logout function
  const logout = () => {
    setLoading(true);
    removeAccessToken();
    removeRefreshToken();
    setUser(null);
    setLoggedOut(true);
    localStorage.removeItem("userId");
    setLoading(false);
    navigate("/login");
  };

  const value = {
    user,
    login,
    logout,
    loading,
    setUser,
    loggedOut,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
