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
  const [loading, setLoading] = useState(false);
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
    try {
      const token = getAccessToken();
      const { data } = await useAxios.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data.user);
      console.log("User data:", data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      removeAccessToken();
      removeRefreshToken();
      setUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const token = getAccessToken();
    if (token) {
      const data = getProfile();
      if (data) {
        setUser(data.user);
      } else {
        setUser(null);
        removeAccessToken();
        removeRefreshToken();
        loggedOut();
      }
    }
  };

  // Logout function
  const logout = () => {
    setLoading(true);
    removeAccessToken();
    removeRefreshToken();
    setUser(null);
    setLoggedOut(true);
    setLoading(false);
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};
