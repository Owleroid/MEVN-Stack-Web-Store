<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center p-6">
    <div class="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <!-- Error Icon -->
      <div class="flex justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-24 w-24 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <!-- Error Message -->
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        {{ $t("notFoundTitle") }}
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        {{ $t("notFoundMessage") }}
      </p>

      <!-- Navigation Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/"
          class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full sm:w-auto text-center"
        >
          {{ $t("goToHome") }}
        </router-link>
        <router-link
          to="/contact"
          class="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-full sm:w-auto text-center"
        >
          {{ $t("contactSupport") }}
        </router-link>
      </div>
    </div>

    <!-- Helpful Links -->
    <div class="mt-8 text-center">
      <h2 class="text-lg font-medium text-gray-700 mb-4">
        {{ $t("helpfulLinks") }}
      </h2>
      <div class="flex flex-wrap justify-center gap-4">
        <router-link
          to="/collections"
          class="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {{ $t("browseProducts") }}
        </router-link>
        <router-link
          to="/login"
          class="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {{ $t("loginToAccount") }}
        </router-link>
        <router-link
          to="/signup"
          class="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {{ $t("createAccount") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
