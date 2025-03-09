<template>
    <div>
        <h1>{{ $t('loginView.login') }}</h1>
        <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" :placeholder="$t('loginView.email')" required />
            <input v-model="password" type="password" :placeholder="$t('loginView.password')" required />
            <button type="submit">{{ $t('loginView.login') }}</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import { useAuthStore } from '../stores/authStore';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

async function handleLogin() {
    try {
        await authStore.login(email.value, password.value);
        router.push('/');
        toast.success(t('loginView.loginSuccess'));
    } catch (error) {
        console.error("Login failed:", error);
        toast.error(t('loginView.loginFailed'));
    }
}
</script>

<style scoped></style>