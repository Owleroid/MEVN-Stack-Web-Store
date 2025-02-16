import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const authService = axios.create({
  baseURL: `${apiUrl}/api/auth`,
  withCredentials: true,
});

export const login = async (email: string, password: string) => {
  const response = await authService.post("/login", { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await authService.post("/logout");
  return response.data;
};

export const signup = async (email: string, password: string) => {
  const response = await authService.post("/signup", { email, password });
  return response.data;
};

export const passwordReset = async (email: string) => {
  const response = await authService.post("/password-reset", { email });
  return response.data;
};

export default authService;
