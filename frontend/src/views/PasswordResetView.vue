<template>
  <div class="password-reset">
    <h1>{{ $t("passwordResetView.passwordReset") }}</h1>
    <form @submit.prevent="handlePasswordReset">
      <div class="form-group">
        <label for="email">{{ $t("passwordResetView.email") }}</label>
        <input
          v-model="email"
          type="email"
          id="email"
          :placeholder="$t('passwordResetView.email')"
          required
        />
      </div>
      <button type="submit">{{ $t("passwordResetView.resetPassword") }}</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import { useAuthStore } from "@/stores/authStore";

const email = ref("");
const error = ref("");
const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

const handlePasswordReset = async () => {
  try {
    await authStore.resetPassword(email.value);
    toast.success(t("passwordResetView.resetEmailSent"));
  } catch (err) {
    error.value = t("passwordResetView.resetFailed");
    toast.error(error.value);
  }
};
</script>

<style scoped>
.password-reset {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.password-reset h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.password-reset form {
  display: flex;
  flex-direction: column;
}

.password-reset .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.password-reset .form-group label {
  margin-bottom: 0.5rem;
}

.password-reset .form-group input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.password-reset button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;
  margin-top: 1rem;
}

.password-reset button:hover {
  background-color: #0056b3;
}

.password-reset p {
  color: red;
  text-align: center;
  margin-top: 1rem;
}
</style>
