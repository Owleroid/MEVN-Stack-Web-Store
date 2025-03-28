<template>
  <div class="user-settings">
    <h1>{{ $t("title") }}</h1>
    <form @submit.prevent="updateUserSettings">
      <div class="form-group">
        <label for="email">{{ $t("email") }}</label>
        <input type="email" id="email" v-model="user.email" disabled />
      </div>
      <div class="form-group">
        <label for="name">{{ $t("name") }}</label>
        <input type="text" id="name" v-model="user.name" />
      </div>
      <div class="form-group">
        <label for="surname">{{ $t("surname") }}</label>
        <input type="text" id="surname" v-model="user.surname" />
      </div>
      <div class="form-group">
        <label for="phone">{{ $t("phone") }}</label>
        <input type="tel" id="phone" v-model="user.phone" />
      </div>
      <div class="form-group">
        <h2>{{ $t("deliveryData.title") }}</h2>
        <label for="country">{{ $t("deliveryData.country") }}</label>
        <input type="text" id="country" v-model="user.deliveryData.country" />
        <label for="city">{{ $t("deliveryData.city") }}</label>
        <input type="text" id="city" v-model="user.deliveryData.city" />
        <label for="street">{{ $t("deliveryData.street") }}</label>
        <input type="text" id="street" v-model="user.deliveryData.street" />
        <label for="buildingNumber">{{
          $t("deliveryData.buildingNumber")
        }}</label>
        <input
          type="text"
          id="buildingNumber"
          v-model="user.deliveryData.buildingNumber"
        />
        <label for="apartment">{{ $t("deliveryData.apartment") }}</label>
        <input
          type="text"
          id="apartment"
          v-model="user.deliveryData.apartment"
        />
        <label for="postalCode">{{ $t("deliveryData.postalCode") }}</label>
        <input
          type="text"
          id="postalCode"
          v-model="user.deliveryData.postalCode"
        />
      </div>
      <button type="submit">{{ $t("update") }}</button>
    </form>

    <form @submit.prevent="changePassword">
      <div class="form-group">
        <h2>{{ $t("changePassword.title") }}</h2>
        <label for="currentPassword">{{
          $t("changePassword.currentPassword")
        }}</label>
        <input
          type="password"
          id="currentPassword"
          v-model="passwords.currentPassword"
        />
        <label for="newPassword">{{ $t("changePassword.newPassword") }}</label>
        <input
          type="password"
          id="newPassword"
          v-model="passwords.newPassword"
        />
        <label for="confirmPassword">{{
          $t("changePassword.confirmPassword")
        }}</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="passwords.confirmPassword"
        />
      </div>
      <button type="submit">
        {{ $t("changePassword.update") }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import { useAuthStore } from "@/stores/authStore";

import {
  getUserData,
  updateUserData,
  changeUserPassword,
} from "@/services/authService";

const { t } = useI18n();
const toast = useToast();
const authStore = useAuthStore();
const user = ref({
  email: "",
  name: "",
  surname: "",
  phone: "",
  deliveryData: {
    country: "",
    city: "",
    street: "",
    buildingNumber: "",
    apartment: "",
    postalCode: "",
  },
});

const passwords = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

onMounted(async () => {
  if (authStore.isAuthenticated) {
    const response = await getUserData(authStore.userId);
    user.value = response;
  }
});

const updateUserSettings = async () => {
  try {
    await updateUserData(authStore.userId, user.value);
    toast.success(t("success"));
  } catch (error) {
    console.error("Failed to update user settings:", error);
    toast.error(t("error"));
  }
};

const changePassword = async () => {
  try {
    if (passwords.value.newPassword === passwords.value.confirmPassword) {
      await changeUserPassword(
        authStore.userId,
        passwords.value.currentPassword,
        passwords.value.newPassword
      );
      toast.success(t("passwordChangeSuccess"));
    } else {
      toast.error(t("passwordMismatch"));
    }
  } catch (error) {
    console.error("Failed to change password:", error);
    toast.error(t("passwordChangeError"));
  }
};
</script>

<style scoped>
.user-settings {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.user-settings h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.user-settings form {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.user-settings .form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.user-settings .form-group label {
  margin-bottom: 0.5rem;
}

.user-settings .form-group input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.user-settings form button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;
}

.user-settings form button:hover {
  background-color: #0056b3;
}
</style>
