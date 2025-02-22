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
            <li><router-link to="/cart">Cart</router-link></li>
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
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
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