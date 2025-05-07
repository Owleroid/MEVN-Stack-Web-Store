import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import i18n from "@/i18n";

import type { UserData, AuthResponse, UpdateResponse } from "@/types/auth";

import { getUserLocation } from "@/services/geolocationService";
import {
  login,
  logout,
  signup,
  passwordReset,
  getUserData,
  updateUserData,
  changeUserPassword,
  checkEmail,
} from "@/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    userId: sessionStorage.getItem("userId") || "",
    userEmail: sessionStorage.getItem("userEmail") || "",
    isAdmin: sessionStorage.getItem("isAdmin") === "true",
    userRegion: sessionStorage.getItem("userRegion") || "",
    language: sessionStorage.getItem("language") || "en",
    currency: sessionStorage.getItem("currency") || "euros",
    userData: null as UserData | null,
  }),

  getters: {
    isLoggedIn(): boolean {
      return this.isAuthenticated && !!this.userId;
    },

    hasDeliveryInfo(): boolean {
      if (!this.userData) return false;
      const delivery = this.userData.deliveryData;
      return !!(
        delivery &&
        (delivery.country ||
          delivery.city ||
          delivery.street ||
          delivery.buildingNumber)
      );
    },
  },

  actions: {
    async login(email: string, password: string): Promise<AuthResponse> {
      try {
        const response = await login(email, password);

        if (response.success && response.userId) {
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.userEmail = email;
          this.isAdmin = !!response.isAdmin;

          sessionStorage.setItem("isAuthenticated", "true");
          sessionStorage.setItem("userId", response.userId);
          sessionStorage.setItem("userEmail", email);

          if (response.isAdmin) {
            sessionStorage.setItem("isAdmin", "true");
          } else {
            sessionStorage.removeItem("isAdmin");
          }

          // Fetch user data
          await this.fetchUserData();

          // Fetch and store user location
          const location = await getUserLocation();
          if (location) {
            this.userRegion = location.country_code;
            sessionStorage.setItem("userRegion", location.country_code);

            // Set language and currency based on user region
            if (location.country_code === "RU") {
              this.setLanguage("ru");
              this.currency = "rubles";
            } else {
              this.setLanguage("en");
              this.currency = "euros";
            }
            sessionStorage.setItem("currency", this.currency);
          }
        }

        return response;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    async logout(): Promise<void> {
      const router = useRouter();
      try {
        await logout();

        this.clearAuthState();
        router.push("/");
      } catch (error) {
        console.error("Logout failed:", error);
        throw error;
      }
    },

    clearAuthState(): void {
      this.isAuthenticated = false;
      this.userId = "";
      this.userEmail = "";
      this.isAdmin = false;
      this.userRegion = "";
      this.userData = null;
      this.setLanguage("en");
      this.currency = "euros";

      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("userEmail");
      sessionStorage.removeItem("isAdmin");
      sessionStorage.removeItem("userRegion");
      sessionStorage.removeItem("language");
      sessionStorage.removeItem("currency");
    },

    async signup(email: string, password: string): Promise<AuthResponse> {
      try {
        return await signup(email, password);
      } catch (error) {
        console.error("Signup failed:", error);
        throw error;
      }
    },

    async resetPassword(email: string): Promise<UpdateResponse> {
      try {
        return await passwordReset(email);
      } catch (error) {
        console.error("Password reset failed:", error);
        throw error;
      }
    },

    async checkEmailExists(email: string): Promise<boolean> {
      try {
        const response = await checkEmail(email);
        return response.exists;
      } catch (error) {
        console.error("Email check failed:", error);
        throw error;
      }
    },

    async fetchUserData(): Promise<UserData | null> {
      try {
        if (!this.userId) return null;

        const userData = await getUserData(this.userId);
        this.userData = userData;
        return userData;
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        return null;
      }
    },

    async updateUserData(userData: Partial<UserData>): Promise<UpdateResponse> {
      try {
        if (!this.userId) {
          throw new Error("No user ID available");
        }

        const response = await updateUserData(this.userId, userData);

        // Refresh user data after update
        await this.fetchUserData();

        return response;
      } catch (error) {
        console.error("User data update failed:", error);
        throw error;
      }
    },

    async changePassword(
      currentPassword: string,
      newPassword: string
    ): Promise<UpdateResponse> {
      try {
        if (!this.userId) {
          throw new Error("No user ID available");
        }

        return await changeUserPassword(
          this.userId,
          currentPassword,
          newPassword
        );
      } catch (error) {
        console.error("Password change failed:", error);
        throw error;
      }
    },

    setLanguage(language: string): void {
      this.language = language;
      sessionStorage.setItem("language", language);
      document.documentElement.lang = language;

      // Update the i18n locale dynamically
      i18n.global.locale.value = language;
    },

    setCurrency(currency: "rubles" | "euros"): void {
      this.currency = currency;
      sessionStorage.setItem("currency", currency);
    },
  },
});
