<template>
    <router-view />
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/authStore';

// Check authentication status on app load
const authStore = useAuthStore();
authStore.isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
</script>