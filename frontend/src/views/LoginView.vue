<template>
  <div class="login">
    <h1>{{ $t("login") }}</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">{{ $t("email") }}</label>
        <input
          v-model="email"
          type="email"
          id="email"
          :placeholder="$t('email')"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">{{ $t("password") }}</label>
        <input
          v-model="password"
          type="password"
          id="password"
          :placeholder="$t('password')"
          required
        />
      </div>
      <div class="form-actions">
        <button type="submit">{{ $t("login") }}</button>
        <button
          @click="goToPasswordReset"
          type="button"
          class="forgot-password"
        >
          {{ $t("forgotPassword") }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import { useAuthStore } from "@/stores/authStore";

const email = ref("");
const password = ref("");
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value);
    router.push("/");
    toast.success(t("loginSuccess"));
  } catch (error) {
    console.error("Login failed:", error);
    toast.error(t("loginFailed"));
  }
}

function goToPasswordReset() {
  router.push("/password-reset");
}
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.login h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.login form {
  display: flex;
  flex-direction: column;
}

.login .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.login .form-group label {
  margin-bottom: 0.5rem;
}

.login .form-group input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login .form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.login button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login button:hover {
  background-color: #0056b3;
}

.forgot-password {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-align: center;
}

.forgot-password:hover {
  text-decoration: underline;
}
</style>
