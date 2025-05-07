<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <!-- Sort Order Filter -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <label
        for="sortOrder"
        class="text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        {{ $t("sortByDate") }}:
      </label>
      <select
        v-model="sortOrderModel"
        id="sortOrder"
        class="mt-1 block w-full sm:w-auto min-w-[180px] py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="newest">{{ $t("newestToOldest") }}</option>
        <option value="oldest">{{ $t("oldestToNewest") }}</option>
      </select>
    </div>

    <!-- Status Filter -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <label
        for="statusFilter"
        class="text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        {{ $t("filterByStatus") }}:
      </label>
      <select
        v-model="statusFilterModel"
        id="statusFilter"
        class="mt-1 block w-full sm:w-auto min-w-[180px] py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="">{{ $t("statuses.all") }}</option>
        <option value="in-progress">{{ $t("statuses.inProgress") }}</option>
        <option value="resolved">{{ $t("statuses.resolved") }}</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type { SupportStatus } from "@/types/support";

// Props & Emits
const props = defineProps<{
  sortOrder: "newest" | "oldest";
  statusFilter: SupportStatus | "";
}>();

const emit = defineEmits<{
  (e: "update:sortOrder", value: "newest" | "oldest"): void;
  (e: "update:statusFilter", value: SupportStatus | ""): void;
}>();

// Computed Properties for v-model
const sortOrderModel = computed({
  get: () => props.sortOrder,
  set: (value: "newest" | "oldest") => emit("update:sortOrder", value),
});

const statusFilterModel = computed({
  get: () => props.statusFilter,
  set: (value: SupportStatus | "") => emit("update:statusFilter", value),
});
</script>
