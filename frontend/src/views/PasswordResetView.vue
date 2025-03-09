<template>
    <div>
        <h1>{{ $t('passwordResetView.passwordReset') }}</h1>
        <form @submit.prevent="handlePasswordReset">
            <input v-model="email" type="email" :placeholder="$t('passwordResetView.email')" required />
            <button type="submit">{{ $t('passwordResetView.resetPassword') }}</button>
        </form>
        <p v-if="error">{{ error }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { useAuthStore } from '../stores/authStore';

const email = ref('');
const error = ref('');
const authStore = useAuthStore();
const toast = useToast();
const { t } = useI18n();

const handlePasswordReset = async () => {
    try {
        await authStore.resetPassword(email.value);
        toast.success(t('passwordResetView.resetEmailSent'));
    } catch (err) {
        error.value = t('passwordResetView.resetFailed');
        toast.error(error.value);
    }
};
</script>