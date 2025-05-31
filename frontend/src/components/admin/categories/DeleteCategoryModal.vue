<template>
  <transition
    enter-active-class="transition-opacity duration-300 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      @click="cancelRemove"
    >
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 transform scale-95"
        leave-to-class="opacity-0 transform scale-95"
        appear
      >
        <div
          class="bg-white rounded-lg w-11/12 max-w-md p-6 shadow-xl"
          @click.stop
        >
          <div class="text-center mb-5">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-xl font-semibold text-gray-800">
                {{ $t("confirmDeletion") }}
              </h2>
              <button
                class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-200"
                @click="cancelRemove"
                aria-label="Close"
              >
                <span class="material-icons text-xl leading-none">close</span>
              </button>
            </div>

            <div class="w-full border-t border-gray-200 my-3"></div>

            <div class="flex items-center justify-center text-amber-600 my-4">
              <span class="material-icons text-3xl">warning</span>
            </div>

            <p class="text-gray-700 mb-3">
              {{ $t("deleteConfirmation") }}
            </p>
          </div>

          <div class="flex flex-col gap-3 mt-6">
            <button
              @click="confirmDelete"
              class="px-5 py-2.5 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span class="material-icons text-sm leading-none">delete</span>
              {{ $t("deleteWithProducts") }}
            </button>

            <button
              @click="openReassignModal"
              class="px-5 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span class="material-icons text-sm leading-none"
                >swap_horiz</span
              >
              {{ $t("reassignAndDelete") }}
            </button>

            <button
              @click="cancelRemove"
              class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm"
            >
              {{ $t("cancel") }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
// Props & Emits
const props = defineProps({
  show: Boolean,
});

const emits = defineEmits([
  "confirmDelete",
  "openReassignModal",
  "cancelRemove",
]);

// Action Handlers
const confirmDelete = () => {
  emits("confirmDelete");
};

const openReassignModal = () => {
  emits("openReassignModal");
};

const cancelRemove = () => {
  emits("cancelRemove");
};
</script>
