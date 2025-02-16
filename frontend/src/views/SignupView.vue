<template>
    <div>
        <h1>Signup</h1>
        <form @submit.prevent="handleSignup">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <button type="submit">Signup</button>
        </form>
        <p v-if="error">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleSignup = async () => {
    try {
        await authStore.signup(email.value, password.value);
        router.push('/login');
    } catch (err) {
        error.value = 'Signup failed. Please try again.';
    }
};
</script>