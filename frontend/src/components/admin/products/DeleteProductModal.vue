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
      @click="$emit('cancel')"
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
                {{ $t("deleteProduct") }}
              </h2>
              <button
                class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-200"
                @click="$emit('cancel')"
                aria-label="Close"
              >
                <span class="material-icons text-xl leading-none">close</span>
              </button>
            </div>

            <div class="w-full border-t border-gray-200 my-3"></div>

            <div class="flex items-center justify-center text-amber-600 my-4">
              <span class="material-icons text-3xl">warning</span>
            </div>

            <div v-if="product" class="mb-3">
              <div class="flex justify-center mb-3">
                <div
                  class="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center"
                >
                  <img
                    v-if="product.imageUrls?.main"
                    :src="product.imageUrls.main"
                    :alt="product.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-gray-400 text-xs"
                  >
                    {{ $t("noImage") }}
                  </div>
                </div>
              </div>
              <h3 class="font-medium text-gray-800 mb-2">{{ product.name }}</h3>
            </div>

            <p class="text-gray-700">
              {{ $t("deleteProductConfirmation") }}
            </p>
          </div>

          <div class="flex justify-center gap-3 mt-6">
            <button
              @click="$emit('cancel')"
              class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors border border-gray-200 shadow-sm"
            >
              {{ $t("cancel") }}
            </button>
            <button
              @click="$emit('confirm')"
              class="px-5 py-2.5 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span class="material-icons text-sm leading-none">delete</span>
              {{ $t("delete") }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
import type { Product } from "@/types/products";

defineProps<{
  show: boolean;
  product?: Product;
}>();

defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();

// Handle image loading errors
const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = "/images/placeholder-product.png";
};
</script>
