<template>
  <div
    class="px-4 py-10 md:max-w-md md:mx-auto min-h-[70vh] flex flex-col items-center justify-center"
  >
    <!-- Error Number with Gradient -->
    <div class="relative w-full text-center mb-6">
      <h1
        class="font-bold text-[160px] md:text-[200px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#3D3D3D] to-transparent"
      >
        404
      </h1>
    </div>

    <!-- Error Message -->
    <div class="text-center mb-6">
      <h2 class="text-2xl md:text-3xl text-main-gray-hover">
        {{ $t("oopsTitle") }}
      </h2>
      <h2 class="text-2xl md:text-3xl text-main-gray-hover mt-1">
        {{ $t("somethingWrong") }}
      </h2>
    </div>

    <!-- 404 Figure Image -->
    <div class="w-full max-w-xs mx-auto mb-8">
      <img
        src="@/assets/images/404-figure.png"
        alt="404 Error Figure"
        class="w-full h-auto"
      />
    </div>

    <!-- Navigation Buttons -->
    <div class="flex flex-col gap-4 w-full max-w-xs">
      <router-link
        to="/"
        class="px-8 py-3 uppercase font-semibold text-white bg-gradient-to-b from-[#BA0913] to-[#530109] border border-[#240000] focus:outline-none text-center"
      >
        {{ $t("goToHome") }}
      </router-link>
      <router-link
        to="/contact"
        class="px-8 py-3 uppercase font-semibold text-white border border-white border-opacity-50 focus:outline-none hover:border-main-red hover:text-main-red transition-colors duration-300 text-center"
      >
        {{ $t("contactSupport") }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
