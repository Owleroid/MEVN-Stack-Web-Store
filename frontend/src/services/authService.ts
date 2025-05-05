import axios from "axios";
import type { AxiosResponse } from "axios";

import type {
  UserData,
  AuthResponse,
  PasswordChangeData,
  EmailCheckResponse,
  UpdateResponse,
} from "@/types/auth";

const apiUrl = import.meta.env.VITE_API_URL;

const authService = axios.create({
  baseURL: `${apiUrl}/api/auth`,
  withCredentials: true,
});

/**
 * Fetches user data by user ID
 * @param userId - The ID of the user to fetch
 * @returns Promise resolving to user data
 */
export const getUserData = async (userId: string): Promise<UserData> => {
  const response: AxiosResponse<UserData> = await authService.get(
    `/users/${userId}`
  );
  return response.data;
};

/**
 * Updates user profile information
 * @param userId - The ID of the user to update
 * @param userData - Partial user data containing fields to update
 * @returns Promise resolving to update response
 */
export const updateUserData = async (
  userId: string,
  userData: Partial<UserData>
): Promise<UpdateResponse> => {
  const response: AxiosResponse<UpdateResponse> = await authService.put(
    `/users/${userId}`,
    userData
  );
  return response.data;
};

/**
 * Changes a user's password
 * @param userId - The ID of the user
 * @param currentPassword - The user's current password
 * @param newPassword - The new password to set
 * @returns Promise resolving to success status and message
 */
export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<UpdateResponse> => {
  const passwordData: PasswordChangeData = { currentPassword, newPassword };
  const response: AxiosResponse<UpdateResponse> = await authService.put(
    `/users/${userId}/password`,
    passwordData
  );
  return response.data;
};

/**
 * Checks if an email is already registered
 * @param email - The email address to check
 * @returns Promise resolving to email check result
 */
export const checkEmail = async (
  email: string
): Promise<EmailCheckResponse> => {
  const response: AxiosResponse<EmailCheckResponse> = await authService.get(
    `/check-email/${email}`
  );
  return response.data;
};

/**
 * Registers a new user
 * @param email - The email address for registration
 * @param password - The password for the new account
 * @returns Promise resolving to authentication response
 */
export const signup = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await authService.post(
    "/signup",
    { email, password }
  );
  return response.data;
};

/**
 * Authenticates a user with credentials
 * @param email - The user's email address
 * @param password - The user's password
 * @returns Promise resolving to authentication response
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await authService.post(
    "/login",
    { email, password }
  );
  return response.data;
};

/**
 * Logs out the currently authenticated user
 * @returns Promise resolving to success status and message
 */
export const logout = async (): Promise<UpdateResponse> => {
  const response: AxiosResponse<UpdateResponse> = await authService.post(
    "/logout"
  );
  return response.data;
};

/**
 * Initiates a password reset process for a user
 * @param email - The email address of the account to reset
 * @returns Promise resolving to success status and message
 */
export const passwordReset = async (email: string): Promise<UpdateResponse> => {
  const response: AxiosResponse<UpdateResponse> = await authService.post(
    "/reset-password",
    { email }
  );
  return response.data;
};

export default authService;
