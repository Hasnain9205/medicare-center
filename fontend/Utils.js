export const getAccessToken = (key = "accessToken") => {
  const token = localStorage.getItem(key);
  if (token) {
    return token;
  }
  return null;
};

export const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

export const removeAccessToken = () => {
  localStorage.removeItem("accessToken");
};

export const getRefreshToken = (key = "refreshToken") => {
  const token = localStorage.getItem(key);
  if (token) {
    return token;
  }
  return null;
};

export const setRefreshToken = (token) => {
  localStorage.setItem("refreshToken", token);
};
export const removeRefreshToken = () => {
  localStorage.removeItem("refreshToken");
};
