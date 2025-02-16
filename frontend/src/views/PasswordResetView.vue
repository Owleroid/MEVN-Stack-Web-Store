<template>
    <div>
        <h1>Password Reset</h1>
        <form @submit.prevent="handlePasswordReset">
            <input v-model="email" type="email" placeholder="Email" required />
            <button type="submit">Reset Password</button>
        </form>
        <p v-if="error">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';

const email = ref('');
const error = ref('');
const authStore = useAuthStore();

const handlePasswordReset = async () => {
    try {
        await authStore.resetPassword(email.value);
        alert('Password reset email sent. Check your inbox.');
    } catch (err) {
        error.value = 'Password reset failed. Please try again.';
    }
};
</script>