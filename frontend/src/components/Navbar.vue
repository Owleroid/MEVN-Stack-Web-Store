<template>
    <nav>
        <ul class="left">
            <li><router-link to="/">Main Page</router-link></li>
            <li><router-link to="/categories">Store</router-link></li>
            <li><router-link to="/news">News</router-link></li>
            <li><router-link to="/about">About</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
        </ul>
        <ul class="right">
            <li class="language-switcher">
                <button @click="toggleLanguage">{{ currentLanguage }}</button>
            </li>
            <li class="cart-link">
                <router-link to="/cart">Cart</router-link>
                <div class="cart-hover-container" v-if="!isCartPage">
                    <CartHoover />
                </div>
            </li>
            <li v-if="!authStore.isAuthenticated"><router-link to="/login">Login</router-link></li>
            <li v-if="!authStore.isAuthenticated"><router-link to="/signup">Sign Up</router-link></li>
            <li v-if="authStore.isAuthenticated" class="dropdown">
                <span>{{ authStore.userEmail }}</span>
                <div class="dropdown-content">
                    <router-link to="/settings">Settings</router-link>
                    <router-link to="/orders">Orders</router-link>
                    <router-link v-if="authStore.isAdmin" to="/admin">Admin Panel</router-link>
                </div>
            </li>
            <li v-if="authStore.isAuthenticated"><button @click="authStore.logout">Logout</button></li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRoute } from 'vue-router';
import CartHoover from './CartHoover.vue';

const authStore = useAuthStore();
const route = useRoute();

const isCartPage = computed(() => route.path === '/cart');

const currentLanguage = computed(() => authStore.language === 'en' ? 'EN' : 'RU');

const toggleLanguage = () => {
    if (authStore.language === 'en') {
        authStore.setLanguage('ru');
    } else {
        authStore.setLanguage('en');
    }
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