import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const authService = axios.create({
  baseURL: `${apiUrl}/api/auth`,
  withCredentials: true,
});

export const getUserData = async (userId: string) => {
  const response = await authService.get(`/users/${userId}`);
  return response.data;
};

export const updateUserData = async (userId: string, userData: any) => {
  const response = await authService.put(`/users/${userId}`, userData);
  return response.data;
};

export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const response = await authService.put(`/users/${userId}/password`, {
    currentPassword,
    newPassword,
  });
  return response.data;
};

export const checkEmail = async (email: string) => {
  const response = await authService.get(`/check-email/${email}`);
  return response.data;
};

export const signup = async (email: string, password: string) => {
  const response = await authService.post("/signup", { email, password });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await authService.post("/login", { email, password });
  return response.data;
};

export const logout = async () => {
  const response = await authService.post("/logout");
  return response.data;
};

export const passwordReset = async (email: string) => {
  const response = await authService.post("/reset-password", { email });
  return response.data;
};

export default authService;
