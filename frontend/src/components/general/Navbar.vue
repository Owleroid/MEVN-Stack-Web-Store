<template>
  <nav>
    <ul class="left">
      <li>
        <router-link to="/">{{ $t("mainPage") }}</router-link>
      </li>
      <li>
        <router-link to="/collections">{{ $t("collections") }}</router-link>
      </li>
      <li>
        <router-link to="/news">{{ $t("news") }}</router-link>
      </li>
      <li>
        <router-link to="/about">{{ $t("about") }}</router-link>
      </li>
      <li>
        <router-link to="/contact">{{ $t("contact") }}</router-link>
      </li>
    </ul>
    <ul class="right">
      <li class="language-switcher">
        <button @click="toggleLanguage">{{ currentLanguage }}</button>
      </li>
      <li class="cart-link">
        <router-link to="/cart">{{ $t("cart") }}</router-link>
        <div class="cart-hover-container" v-if="!isCartPage">
          <CartHoover />
        </div>
      </li>
      <li v-if="!authStore.isAuthenticated">
        <router-link to="/login">{{ $t("login") }}</router-link>
      </li>
      <li v-if="!authStore.isAuthenticated">
        <router-link to="/signup">{{ $t("signup") }}</router-link>
      </li>
      <li v-if="authStore.isAuthenticated" class="dropdown">
        <span>{{ authStore.userEmail }}</span>
        <div class="dropdown-content">
          <router-link to="/settings">{{ $t("settings") }}</router-link>
          <router-link to="/orders">{{ $t("orders") }}</router-link>
          <router-link v-if="authStore.isAdmin" to="/admin">{{
            $t("adminPanel")
          }}</router-link>
        </div>
      </li>
      <li v-if="authStore.isAuthenticated">
        <button @click="authStore.logout">{{ $t("logout") }}</button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import CartHoover from "./CartHoover.vue";
import { useAuthStore } from "@/stores/authStore";
import { loadLocaleMessages } from "@/i18n"; // Ensure loadLocaleMessages is correctly imported
import i18n from "@/i18n"; // Import the default i18n instance

const authStore = useAuthStore();
const route = useRoute();
const { locale, t } = useI18n();

const isCartPage = computed(() => route.path === "/cart");

const currentLanguage = computed(() => (locale.value === "en" ? "EN" : "RU"));

const toggleLanguage = async () => {
  if (locale.value === "en") {
    locale.value = "ru"; // Update the i18n locale
    sessionStorage.setItem("language", "ru"); // Persist the language
  } else {
    locale.value = "en";
    sessionStorage.setItem("language", "en");
  }

  // Force reload translations
  const messages = await loadLocaleMessages(locale.value); // Ensure this function is correctly implemented in "@/i18n"
  i18n.global.setLocaleMessage(locale.value, messages);

  console.log("Locale switched to:", locale.value); // Debugging
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #333;
  color: white;
}

ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

a {
  color: white;
  text-decoration: none;
}

button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.cart-link {
  position: relative;
}

.cart-hover-container {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  background: white;
  color: black;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: auto;
  width: auto;
}

.cart-link:hover .cart-hover-container {
  display: block;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
