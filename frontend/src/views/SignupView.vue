<template>
  <div class="signup">
    <h1>{{ $t("signupView.signup") }}</h1>
    <form @submit.prevent="handleSignup">
      <div class="form-group">
        <label for="email">{{ $t("signupView.email") }}</label>
        <input
          v-model="email"
          type="email"
          id="email"
          :placeholder="$t('signupView.email')"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">{{ $t("signupView.password") }}</label>
        <input
          v-model="password"
          type="password"
          id="password"
          :placeholder="$t('signupView.password')"
          required
        />
      </div>
      <button type="submit">{{ $t("signupView.signup") }}</button>
    </form>
    <p v-if="error">{{ error }}</p>
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
const error = ref("");
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const handleSignup = async () => {
  try {
    await authStore.signup(email.value, password.value);
    router.push("/login");
    toast.success(t("signupView.signupSuccess"));
  } catch (err) {
    error.value = t("signupView.signupFailed");
    toast.error(error.value);
  }
};
</script>

<style scoped>
.signup {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.signup h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.signup form {
  display: flex;
  flex-direction: column;
}

.signup .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.signup .form-group label {
  margin-bottom: 0.5rem;
}

.signup .form-group input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.signup button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;
  margin-top: 1rem;
}

.signup button:hover {
  background-color: #0056b3;
}

.signup p {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>
