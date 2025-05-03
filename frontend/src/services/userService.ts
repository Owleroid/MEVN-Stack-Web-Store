import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const usersService = axios.create({
  baseURL: `${apiUrl}/api/users`,
  withCredentials: true,
});

export const getAllUsers = async () => {
  return usersService.get(`/`);
};

export default usersService;
