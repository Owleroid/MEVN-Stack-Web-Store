import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { login, logout, signup, passwordReset } from "../services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: sessionStorage.getItem("isAuthenticated") === "true",
    userEmail: sessionStorage.getItem("userEmail") || "",
    isAdmin: sessionStorage.getItem("isAdmin") === "true",
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const response = await login(email, password);
        this.isAuthenticated = true;
        this.userEmail = email;
        this.isAdmin = response.isAdmin;

        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userEmail", email);
        if (response.isAdmin) {
          sessionStorage.setItem("isAdmin", "true");
        } else {
          sessionStorage.removeItem("isAdmin");
        }
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
        this.isAdmin = false;

        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("isAdmin");
      } catch (error) {
        console.error("Logout failed:", error);
        throw error;
      }
    },

    async signup(email: string, password: string) {
      try {
        await signup(email, password);
        const router = useRouter();
        router.push({ name: "login" });
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
