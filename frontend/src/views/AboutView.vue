<template>
  <div class="max-w-3xl mx-auto px-4 py-12 text-center">
    <h1 class="text-4xl font-bold mb-6 text-main-red">
      {{ $t("aboutTitle") }}
    </h1>
    <p class="text-lg text-main-gray-hover mb-8">{{ $t("aboutSubtitle") }}</p>
    <div class="space-y-6 text-base text-gray-200">
      <p>{{ $t("aboutP1") }}</p>
      <p>{{ $t("aboutP2") }}</p>
      <p>{{ $t("aboutP3") }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { locale } = useI18n();
</script>
