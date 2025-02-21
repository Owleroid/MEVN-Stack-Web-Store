<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

async function handleLogin() {
    try {
        await authStore.login(email.value, password.value);
        router.push('/');
    } catch (error) {
        console.error("Login failed:", error);
        // To do: Handle login error (e.g., show a message to the user)
    }
}
</script>

<style scoped></style>