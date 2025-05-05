import axios from "axios";
import type { AxiosResponse } from "axios";

import type { UserData } from "@/types/auth";

const apiUrl = import.meta.env.VITE_API_URL;

interface UsersListResponse {
  success: boolean;
  count: number;
  users: UserData[];
}

/**
 * Axios instance configured for user management API requests
 */
const usersService = axios.create({
  baseURL: `${apiUrl}/api/users`,
  withCredentials: true,
});

/**
 * Retrieves all users (admin only)
 * @returns Promise resolving to list of all users
 */
export const getAllUsers = async (): Promise<UsersListResponse> => {
  const response: AxiosResponse<UsersListResponse> = await usersService.get(
    "/"
  );
  return response.data;
};

/**
 * Retrieves a specific user by ID
 * @param userId - ID of the user to fetch
 * @returns Promise resolving to user data
 */
export const getUserById = async (userId: string): Promise<UserData> => {
  const response: AxiosResponse<UserData> = await usersService.get(
    `/${userId}`
  );
  return response.data;
};

export default usersService;
