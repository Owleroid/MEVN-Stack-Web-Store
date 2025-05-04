<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("email") }}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("subject") }}
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ $t("date") }}
          </th>
          <slot name="headerColumns"></slot>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="message in messages"
          :key="message._id"
          class="hover:bg-gray-50 cursor-pointer"
        >
          <td
            class="px-6 py-4 whitespace-nowrap"
            @click="$emit('view', message)"
          >
            {{ message.email }}
          </td>
          <td class="px-6 py-4" @click="$emit('view', message)">
            {{ message.subject || $t("noSubject") }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap"
            @click="$emit('view', message)"
          >
            {{ formatDate(message.createdAt) }}
          </td>
          <slot name="rowColumns" v-bind:message="message"></slot>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { SupportMessage } from "@/types/support";

const props = defineProps<{
  messages: SupportMessage[];
}>();

const emit = defineEmits<{
  (e: "view", message: SupportMessage): void;
  (e: "respond", message: SupportMessage): void;
}>();

const { locale } = useI18n();

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale.value === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};
</script>
