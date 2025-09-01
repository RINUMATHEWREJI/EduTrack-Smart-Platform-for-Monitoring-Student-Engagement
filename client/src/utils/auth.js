import { jwtDecode } from "jwt-decode";

export const setTokens = (access, refresh, user) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
  localStorage.setItem("user", JSON.stringify(user)); // store user object safely
};

export const getAccessToken = () => localStorage.getItem("access");

export const getUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const getUserFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;
  try {
    return jwtDecode(token); // returns decoded JWT payload
  } catch (error) {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};
