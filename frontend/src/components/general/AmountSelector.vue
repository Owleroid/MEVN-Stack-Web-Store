<template>
  <div class="relative flex items-center justify-center h-[48px]">
    <!-- Gradient border using pseudo-element -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-white via-white/50 to-transparent opacity-80"
    ></div>

    <!-- Component content with black background to create border effect -->
    <div class="absolute inset-[1px] bg-[#0E0E0E]"></div>

    <!-- Content -->
    <div class="relative flex items-center justify-center w-full h-full z-10">
      <button
        @click="decreaseAmount"
        class="w-10 h-full flex items-center justify-center text-main-gray-hover hover:text-white transition-colors"
        :class="{ 'opacity-50 cursor-not-allowed': amount <= 1 }"
        :disabled="amount <= 1"
      >
        <svg
          width="13"
          height="4"
          viewBox="0 0 13 4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.0581 0.222222H0.0581055V3.22222H12.0581V0.222222Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div class="w-10 h-full flex items-center justify-center">
        <span class="text-2xl font-medium text-main-gray-hover/80">{{
          amount
        }}</span>
      </div>

      <button
        @click="increaseAmount"
        class="w-10 h-full flex items-center justify-center text-main-gray-hover hover:text-white transition-colors"
      >
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.2417 6.55556H9.24173V0.555556H5.24173V6.55556H0.241731V10.5556H5.24173V16.5556H9.24173V10.5556H15.2417V6.55556Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

interface Props {
  initialAmount?: number;
  maxAmount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  initialAmount: 1,
  maxAmount: 99,
});

const emit = defineEmits<{
  (e: "update:amount", value: number): void;
}>();

const amount = ref(props.initialAmount);

function increaseAmount(): void {
  if (amount.value < props.maxAmount) {
    amount.value++;
    emit("update:amount", amount.value);
  }
}

function decreaseAmount(): void {
  if (amount.value > 1) {
    amount.value--;
    emit("update:amount", amount.value);
  }
}

// Watch for external changes to initialAmount
watch(
  () => props.initialAmount,
  (newValue) => {
    amount.value = newValue;
  }
);
</script>

<style scoped>
.bg-gradient-to-br {
  background-image: linear-gradient(
    216.35deg,
    #ffffff 1.39%,
    rgba(255, 255, 255, 0) 98.6%
  );
}
</style>
