<template>
  <div
    v-if="totalPages > 1"
    class="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
  >
    <!-- Desktop pagination -->
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          {{ $t("showing") }} {{ (currentPage - 1) * itemsPerPage + 1 }}
          {{ $t("to") }}
          {{ Math.min(currentPage * itemsPerPage, totalItems) }}
          {{ $t("of") }} {{ totalItems }} {{ $t("results") }}
        </p>
      </div>
      <div>
        <nav
          class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <!-- Previous page button -->
          <button
            @click="
              $emit('update:currentPage', currentPage > 1 ? currentPage - 1 : 1)
            "
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            &laquo;
          </button>

          <!-- Page number buttons -->
          <button
            v-for="page in paginationRange"
            :key="page"
            @click="$emit('update:currentPage', page)"
            :class="[
              'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
              currentPage === page
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>

          <!-- Next page button -->
          <button
            @click="
              $emit(
                'update:currentPage',
                currentPage < totalPages ? currentPage + 1 : totalPages
              )
            "
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            :class="{
              'opacity-50 cursor-not-allowed': currentPage === totalPages,
            }"
          >
            &raquo;
          </button>
        </nav>
      </div>
    </div>

    <!-- Mobile pagination -->
    <div class="flex-1 flex justify-between sm:hidden">
      <button
        @click="
          $emit('update:currentPage', currentPage > 1 ? currentPage - 1 : 1)
        "
        :disabled="currentPage === 1"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
      >
        {{ $t("previous") }}
      </button>
      <button
        @click="
          $emit(
            'update:currentPage',
            currentPage < totalPages ? currentPage + 1 : totalPages
          )
        "
        :disabled="currentPage === totalPages"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
      >
        {{ $t("next") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Props
const props = defineProps<{
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}>();

// Emits
const emit = defineEmits<{
  (e: "update:currentPage", page: number): void;
}>();

// Computed Properties
const totalPages = computed((): number => {
  return Math.ceil(props.totalItems / props.itemsPerPage);
});

const paginationRange = computed((): number[] => {
  const range: number[] = [];
  const maxDisplayedPages = 5;

  if (totalPages.value <= maxDisplayedPages) {
    // If we have fewer pages than our max display, show all pages
    for (let i = 1; i <= totalPages.value; i++) {
      range.push(i);
    }
  } else {
    // Calculate a window around the current page
    let start = Math.max(1, props.currentPage - 2);
    let end = Math.min(totalPages.value, start + maxDisplayedPages - 1);

    // Adjust the start if we're near the end
    if (end - start + 1 < maxDisplayedPages) {
      start = Math.max(1, end - maxDisplayedPages + 1);
    }

    // Generate the page numbers
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
  }

  return range;
});
</script>
