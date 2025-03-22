import { defineStore } from "pinia";
import { useRouter } from "vue-router";

import { getUserLocation } from "../services/geolocationService";
import { login, logout, signup, passwordReset } from "../services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    userId: sessionStorage.getItem("userId") || "",
    userEmail: sessionStorage.getItem("userEmail") || "",
    isAdmin: sessionStorage.getItem("isAdmin") === "true",
    userRegion: sessionStorage.getItem("userRegion") || "",
    language: sessionStorage.getItem("language") || "en",
    currency: sessionStorage.getItem("currency") || "euros",
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await login(email, password);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.userEmail = email;
        this.isAdmin = response.isAdmin;

        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userId", response.userId);
        sessionStorage.setItem("userEmail", email);
        if (response.isAdmin) {
          sessionStorage.setItem("isAdmin", "true");
        } else {
          sessionStorage.removeItem("isAdmin");
        }

        // Fetch and store user location
        const location = await getUserLocation();
        if (location) {
          this.userRegion = location.country_code;
          sessionStorage.setItem("userRegion", location.country_code);

          // Set language and currency based on user region
          if (location.country_code === "RU") {
            this.language = "ru";
            this.currency = "rubles";
          } else {
            this.language = "en";
            this.currency = "euros";
          }
          sessionStorage.setItem("language", this.language);
          sessionStorage.setItem("currency", this.currency);
        }
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    async logout() {
      const router = useRouter();
      try {
        await logout();
        this.isAuthenticated = false;
        this.userId = "";
        this.userEmail = "";
        this.isAdmin = false;
        this.userRegion = "";
        this.language = "en";
        this.currency = "euros";

        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("isAdmin");
        sessionStorage.removeItem("userRegion");
        sessionStorage.removeItem("language");
        sessionStorage.removeItem("currency");

        router.push("/");
      } catch (error) {
        console.error("Logout failed:", error);
        throw error;
      }
    },

    async signup(email: string, password: string) {
      try {
        await signup(email, password);
      } catch (error) {
        console.error("Signup failed:", error);
        throw error;
      }
    },

    async resetPassword(email: string) {
      try {
        await passwordReset(email);
      } catch (error) {
        console.error("Password reset failed:", error);
        throw error;
      }
    },

    setLanguage(language: string) {
      this.language = language;
      sessionStorage.setItem("language", language);
      document.documentElement.lang = language;
    },
  },
});
