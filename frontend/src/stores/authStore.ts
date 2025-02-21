import { defineStore } from "pinia";
import { login, logout, signup, passwordReset } from "../services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    userEmail: sessionStorage.getItem("userEmail") || "",
  }),
  actions: {
    async login(email: string, password: string) {
      try {
        await login(email, password);
        this.isAuthenticated = true;
        this.userEmail = email;
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userEmail", email);
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    async logout() {
      try {
        await logout();
        this.isAuthenticated = false;
        this.userEmail = "";
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("userEmail");
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
  },
});
