/**
 * User data interface representing user profile information based on backend UserModel
 */
export interface UserData {
  _id?: string;
  id: string;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  isAdmin?: boolean;
  registrationDate?: Date;
  deliveryData?: {
    country?: string;
    city?: string;
    street?: string;
    buildingNumber?: string;
    apartment?: string;
    postalCode?: string;
  };
}

/**
 * Authentication response interface returned after login or signup
 */
export interface AuthResponse {
  user?: UserData;
  userId?: string;
  isAdmin?: boolean;
  token?: string;
  success?: boolean;
  message?: string;
}

/**
 * Data required for password change operations
 */
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Email availability check response interface
 */
export interface EmailCheckResponse {
  exists: boolean;
  message?: string;
}

/**
 * Response for update operations
 */
export interface UpdateResponse {
  success: boolean;
  message: string;
}
