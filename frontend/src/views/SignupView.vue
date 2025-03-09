<template>
    <div>
        <h1>{{ $t('signupView.signup') }}</h1>
        <form @submit.prevent="handleSignup">
            <input v-model="email" type="email" :placeholder="$t('signupView.email')" required />
            <input v-model="password" type="password" :placeholder="$t('signupView.password')" required />
            <button type="submit">{{ $t('signupView.signup') }}</button>
        </form>
        <p v-if="error">{{ error }}</p>
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
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const { t } = useI18n();

const handleSignup = async () => {
    try {
        await authStore.signup(email.value, password.value);
        router.push('/login');
        toast.success(t('signupView.signupSuccess'));
    } catch (err) {
        error.value = t('signupView.signupFailed');
        toast.error(error.value);
    }
};
</script>