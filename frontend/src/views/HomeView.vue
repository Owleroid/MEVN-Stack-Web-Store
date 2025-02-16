<template>
    <div>
        <h1>Welcome to the Home Page</h1>
        <button @click="handleLogout">Logout</button>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
};
</script>