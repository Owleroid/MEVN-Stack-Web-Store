<template>
  <nav
    v-if="!translationsLoading"
    class="px-4 py-4 md:relative z-40"
    :class="{
      'fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-[#191919] to-[#0E0E0E]':
        isMobileOrTablet,
    }"
  >
    <!-- Top section - Logo and mobile controls only visible on mobile/tablet -->
    <div class="max-w-7xl mx-auto flex justify-between items-center md:hidden">
      <!-- Logo -->
      <router-link to="/" class="text-3xl font-medium"> IRBIS </router-link>

      <!-- Mobile Navigation Controls -->
      <div class="flex items-center space-x-6">
        <!-- Cart Icon with Badge -->
        <div class="relative group">
          <router-link
            to="/cart"
            class="transition-colors duration-500 ease-in-out block"
            :class="{
              'text-main-red':
                (cartItemsCount > 0 && isMobileOrTablet) ||
                route.path === '/cart',
              'text-main-gray-hover': !(
                (cartItemsCount > 0 && isMobileOrTablet) ||
                route.path === '/cart'
              ),
            }"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 17 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="scale-125"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.3424 1.55535L16.8242 1.55535L16.8242 0.5L13.6637 0.5L12.5597 2.92177L0.799732 2.92177L2.59554 10.19L11.2535 10.19L13.3916 3.64137L14.3424 1.55535ZM12.1718 3.97712L10.4879 9.13469L3.42188 9.13469L2.14757 3.97712L12.1718 3.97712Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.59108 11.102C4.19368 11.102 3.87152 11.4241 3.87152 11.8215C3.87152 12.2189 4.19368 12.5411 4.59108 12.5411C4.98848 12.5411 5.31064 12.2189 5.31064 11.8215C5.31064 11.4241 4.98848 11.102 4.59108 11.102ZM2.91211 11.8215C2.91211 10.8943 3.66381 10.1426 4.59108 10.1426C5.51835 10.1426 6.27005 10.8943 6.27005 11.8215C6.27005 12.7488 5.51835 13.5005 4.59108 13.5005C3.66381 13.5005 2.91211 12.7488 2.91211 11.8215Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.38795 11.102C8.99055 11.102 8.66839 11.4241 8.66839 11.8215C8.66839 12.2189 8.99055 12.5411 9.38795 12.5411C9.78535 12.5411 10.1075 12.2189 10.1075 11.8215C10.1075 11.4241 9.78535 11.102 9.38795 11.102ZM7.70898 11.8215C7.70898 10.8943 8.46068 10.1426 9.38795 10.1426C10.3152 10.1426 11.0669 10.8943 11.0669 11.8215C11.0669 12.7488 10.3152 13.5005 9.38795 13.5005C8.46068 13.5005 7.70898 12.7488 7.70898 11.8215Z"
                fill="currentColor"
              />
            </svg>
            <!-- Cart Badge - Mobile version -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="transform scale-0 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-0 opacity-0"
            >
              <span
                v-if="cartItemsCount > 0 && isMobileOrTablet"
                class="absolute top-1 right-3 -mt-1 -mr-1.5 px-1 py-0 bg-main-red text-white text-[0.6rem] font-bold rounded-full leading-none min-w-[0.9rem] h-[0.9rem] flex items-center justify-center"
              >
                {{ cartItemsCount }}
              </span>
            </transition>
          </router-link>

          <!-- Transparent bridge for cart dropdown -->
          <div class="absolute w-full h-2 top-full left-0 bg-transparent"></div>
        </div>

        <!-- Profile Icon (Mobile & Tablet only) - Only visible when logged in -->
        <router-link
          v-if="authStore.isAuthenticated && isMobileOrTablet"
          to="/settings"
          class="transition-colors duration-500 ease-in-out block"
          :class="{
            'text-main-red':
              route.path === '/settings' || route.path === '/orders',
            'text-main-gray-hover':
              route.path !== '/settings' && route.path !== '/orders',
          }"
        >
          <svg
            width="19.5"
            height="19.5"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="scale-125"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.5147 7.85937L14.7981 11.2219L14.7981 13.7755L13.741 13.7755L13.741 11.8982L7.51649 9.02451L1.34421 11.8971L1.34421 13.7755L0.28712 13.7755L0.287109 11.2231L7.5147 7.85937Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.54244 1.2817C5.71138 1.2817 4.22702 2.76607 4.22702 4.59713C4.22702 6.42819 5.71138 7.91256 7.54244 7.91256C9.3735 7.91256 10.8579 6.42819 10.8579 4.59713C10.8579 2.76607 9.3735 1.2817 7.54244 1.2817ZM3.16992 4.59713C3.16992 2.18225 5.12757 0.224609 7.54244 0.224609C9.95732 0.224609 11.915 2.18225 11.915 4.59713C11.915 7.01201 9.95732 8.96965 7.54244 8.96965C5.12757 8.96965 3.16992 7.01201 3.16992 4.59713Z"
              fill="currentColor"
            />
          </svg>
        </router-link>

        <!-- Language Switcher -->
        <button
          @click="toggleLanguage"
          class="px-2 py-1 rounded-md text-main-red text-sm font-normal transition-colors duration-500 ease-in-out border border-main-red cursor-pointer"
        >
          {{ currentLanguage }}
        </button>

        <!-- Hamburger Menu Button - Visible on mobile and tablet, hidden on desktop -->
        <button
          @click="toggleMobileMenu"
          class="flex md:hidden flex-col justify-center items-center w-8 h-12 p-1 space-y-1.5 transition-colors duration-500 ease-in-out"
          :class="{
            'text-main-red': mobileMenuOpen,
            'text-main-gray-hover': !mobileMenuOpen,
          }"
        >
          <span class="block w-full h-0.5 bg-current"></span>
          <span class="block w-full h-0.5 bg-current"></span>
          <span class="block w-full h-0.5 bg-current"></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu - Used for both mobile and tablet -->
    <transition
      enter-active-class="transition-all ease-out duration-500"
      enter-from-class="transform translate-x-full"
      enter-to-class="transform translate-x-0"
      leave-active-class="transition-all ease-in duration-500"
      leave-from-class="transform translate-x-0"
      leave-to-class="transform translate-x-full"
    >
      <div
        v-if="mobileMenuOpen"
        class="fixed top-0 right-0 bottom-0 z-50 bg-gradient-to-r from-[#191919] to-[#0E0E0E] h-screen w-screen shadow-[-10px_0_15px_rgba(0,0,0,0.3)] flex flex-col justify-between overflow-hidden"
      >
        <!-- Close Button -->
        <button
          @click="closeMobileMenu"
          class="absolute top-6 right-6 text-main-red p-3"
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col justify-center">
          <div class="flex flex-col space-y-7 items-center text-center px-8">
            <!-- Main Navigation Links -->
            <router-link
              to="/"
              class="text-2xl text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-200"
              :class="{ 'text-main-red': route.path === '/' }"
              @click="closeMobileMenu"
            >
              {{ $t("mainPage") }}
            </router-link>
            <router-link
              to="/collections"
              class="text-2xl text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-200"
              :class="{
                'text-main-red':
                  route.path.startsWith('/collections') ||
                  route.path === '/' + route.params.slug,
              }"
              @click="closeMobileMenu"
            >
              {{ $t("collections") }}
            </router-link>
            <router-link
              to="/news"
              class="text-2xl text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-200"
              :class="{ 'text-main-red': route.path.startsWith('/news') }"
              @click="closeMobileMenu"
            >
              {{ $t("news") }}
            </router-link>
            <router-link
              to="/about"
              class="text-2xl text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-200"
              :class="{ 'text-main-red': route.path === '/about' }"
              @click="closeMobileMenu"
            >
              {{ $t("about") }}
            </router-link>
            <router-link
              to="/contact"
              class="text-2xl text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-200"
              :class="{ 'text-main-red': route.path === '/contact' }"
              @click="closeMobileMenu"
            >
              {{ $t("contact") }}
            </router-link>

            <!-- User Management Links (Only when not authenticated) -->
            <div
              v-if="!authStore.isAuthenticated"
              class="pt-6 mt-4 border-t border-main-red w-36"
            >
              <router-link
                to="/login"
                class="block py-3 text-2xl text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-200"
                :class="{ 'text-main-red': route.path === '/login' }"
                @click="closeMobileMenu"
              >
                {{ $t("login") }}
              </router-link>
              <router-link
                to="/signup"
                class="block py-3 text-2xl text-gray-400 transition-colors duration-300 ease-in-out hover:text-gray-200"
                :class="{ 'text-main-red': route.path === '/signup' }"
                @click="closeMobileMenu"
              >
                {{ $t("signup") }}
              </router-link>
            </div>

            <!-- User Account Section (Only when authenticated) -->
            <div
              v-if="authStore.isAuthenticated"
              class="pt-6 mt-4 border-t border-main-red flex flex-col items-center w-36"
            >
              <p class="text-gray-500 mb-2 text-base">
                {{ authStore.userEmail }}
              </p>

              <!-- Admin Panel Link (Only when user is admin) -->
              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                class="py-2 px-6 text-2xl text-gray-400 hover:text-main-red transition-colors duration-300 ease-in-out whitespace-nowrap"
                :class="{ 'text-main-red': route.path.startsWith('/admin') }"
                @click="closeMobileMenu"
              >
                {{ $t("adminPanel") }}
              </router-link>

              <!-- Logout Button -->
              <button
                @click="handleLogoutAndCloseMobileMenu"
                class="py-2 px-6 text-2xl text-gray-400 hover:text-main-red transition-colors duration-300 ease-in-out"
              >
                {{ $t("logout") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Indicator Arrow -->
        <div class="pb-6 flex justify-center">
          <svg
            class="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
    </transition>

    <!-- Desktop Navigation - Hidden on Mobile and Tablet, Visible on Medium Screens and Up -->
    <div
      class="hidden md:flex md:flex-row md:items-center md:mt-0 md:py-2 max-w-7xl mx-auto relative"
    >
      <!-- Logo for Desktop -->
      <div
        class="md:absolute md:left-0 md:top-1/2 md:transform md:-translate-y-1/2 md:flex md:items-center"
      >
        <router-link to="/" class="font-medium text-xl md:text-3xl">
          IRBIS
        </router-link>
      </div>

      <!-- Main Navigation Links -->
      <div class="flex justify-center items-center w-full">
        <div class="inline-flex justify-center items-center">
          <router-link
            to="/"
            class="text-main-gray-hover transition-colors duration-500 ease-in-out text-lg relative pb-1 border-b-2 border-main-gray-hover hover:border-main-red hover:text-main-red px-4"
            :class="{ 'text-main-red border-main-red': route.path === '/' }"
          >
            {{ $t("mainPage") }}
          </router-link>
          <router-link
            to="/collections"
            class="text-main-gray-hover transition-colors duration-500 ease-in-out text-lg relative pb-1 border-b-2 border-main-gray-hover hover:border-main-red hover:text-main-red px-4"
            :class="{
              'text-main-red border-main-red':
                route.path.startsWith('/collections') ||
                route.path === '/' + route.params.slug,
            }"
          >
            {{ $t("collections") }}
          </router-link>
          <router-link
            to="/news"
            class="text-main-gray-hover transition-colors duration-500 ease-in-out text-lg relative pb-1 border-b-2 border-main-gray-hover hover:border-main-red hover:text-main-red px-4"
            :class="{
              'text-main-red border-main-red': route.path.startsWith('/news'),
            }"
          >
            {{ $t("news") }}
          </router-link>
          <router-link
            to="/about"
            class="text-main-gray-hover transition-colors duration-500 ease-in-out text-lg relative pb-1 border-b-2 border-main-gray-hover hover:border-main-red hover:text-main-red px-4"
            :class="{
              'text-main-red border-main-red': route.path === '/about',
            }"
          >
            {{ $t("about") }}
          </router-link>
          <router-link
            to="/contact"
            class="text-main-gray-hover transition-colors duration-500 ease-in-out text-lg relative pb-1 border-b-2 border-main-gray-hover hover:border-main-red hover:text-main-red px-4"
            :class="{
              'text-main-red border-main-red': route.path === '/contact',
            }"
          >
            {{ $t("contact") }}
          </router-link>
        </div>
      </div>

      <!-- Right Side Elements -->
      <div
        class="md:absolute md:right-0 md:top-1/2 md:transform md:-translate-y-1/2 flex items-center space-x-6 z-[150]"
      >
        <!-- Cart Icon with Badge -->
        <div class="relative group">
          <router-link
            to="/cart"
            class="transition-colors duration-500 ease-in-out block"
            :class="{
              'text-main-red': cartItemsCount > 0 || route.path === '/cart',
              'text-main-gray-hover': !(
                cartItemsCount > 0 || route.path === '/cart'
              ),
            }"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 17 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="scale-125"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M14.3424 1.55535L16.8242 1.55535L16.8242 0.5L13.6637 0.5L12.5597 2.92177L0.799732 2.92177L2.59554 10.19L11.2535 10.19L13.3916 3.64137L14.3424 1.55535ZM12.1718 3.97712L10.4879 9.13469L3.42188 9.13469L2.14757 3.97712L12.1718 3.97712Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.59108 11.102C4.19368 11.102 3.87152 11.4241 3.87152 11.8215C3.87152 12.2189 4.19368 12.5411 4.59108 12.5411C4.98848 12.5411 5.31064 12.2189 5.31064 11.8215C5.31064 11.4241 4.98848 11.102 4.59108 11.102ZM2.91211 11.8215C2.91211 10.8943 3.66381 10.1426 4.59108 10.1426C5.51835 10.1426 6.27005 10.8943 6.27005 11.8215C6.27005 12.7488 5.51835 13.5005 4.59108 13.5005C3.66381 13.5005 2.91211 12.7488 2.91211 11.8215Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.38795 11.102C8.99055 11.102 8.66839 11.4241 8.66839 11.8215C8.66839 12.2189 8.99055 12.5411 9.38795 12.5411C9.78535 12.5411 10.1075 12.2189 10.1075 11.8215C10.1075 11.4241 9.78535 11.102 9.38795 11.102ZM7.70898 11.8215C7.70898 10.8943 8.46068 10.1426 9.38795 10.1426C10.3152 10.1426 11.0669 10.8943 11.0669 11.8215C11.0669 12.7488 10.3152 13.5005 9.38795 13.5005C8.46068 13.5005 7.70898 12.7488 7.70898 11.8215Z"
                fill="currentColor"
              />
            </svg>
            <!-- Cart Badge - Desktop version -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="transform scale-0 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-0 opacity-0"
            >
              <span
                v-if="cartItemsCount > 0 && !isMobileOrTablet"
                class="absolute top-1 right-2.5 -mt-1 -mr-1 px-1 py-0 bg-red-500 text-white text-[0.6rem] font-bold rounded-full leading-none min-w-[0.9rem] h-[0.9rem] flex items-center justify-center"
              >
                {{ cartItemsCount }}
              </span>
            </transition>
          </router-link>
        </div>

        <!-- Language Switcher -->
        <button
          @click="toggleLanguage"
          class="px-2 py-1 rounded-md text-main-red text-sm font-normal transition-colors duration-500 ease-in-out border border-main-red cursor-pointer"
        >
          {{ currentLanguage }}
        </button>

        <!-- Login Link -->
        <div
          v-if="!authStore.isAuthenticated"
          class="flex items-center space-x-4"
        >
          <router-link
            to="/login"
            class="transition-colors duration-500 ease-in-out block hover:text-main-red"
            :class="{
              'text-main-red':
                route.path === '/login' ||
                route.path === '/signup' ||
                route.path === '/password-reset',
              'text-main-gray-hover': !(
                route.path === '/login' ||
                route.path === '/signup' ||
                route.path === '/password-reset'
              ),
            }"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="scale-125"
            >
              <path
                d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 17L15 12L10 7"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15 12H3"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
        </div>

        <!-- User Dropdown -->
        <div v-if="authStore.isAuthenticated" class="relative z-[200]">
          <button
            @click="userDropdownOpen = !userDropdownOpen"
            class="flex items-center space-x-1 hover:text-gray-200 focus:outline-none p-2 user-dropdown-button text-main-red cursor-pointer"
          >
            <svg
              width="19.5"
              height="19.5"
              viewBox="0 0 15 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="scale-125"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.5147 7.85937L14.7981 11.2219L14.7981 13.7755L13.741 13.7755L13.741 11.8982L7.51649 9.02451L1.34421 11.8971L1.34421 13.7755L0.28712 13.7755L0.287109 11.2231L7.5147 7.85937Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M7.54244 1.2817C5.71138 1.2817 4.22702 2.76607 4.22702 4.59713C4.22702 6.42819 5.71138 7.91256 7.54244 7.91256C9.3735 7.91256 10.8579 6.42819 10.8579 4.59713C10.8579 2.76607 9.3735 1.2817 7.54244 1.2817ZM3.16992 4.59713C3.16992 2.18225 5.12757 0.224609 7.54244 0.224609C9.95732 0.224609 11.915 2.18225 11.915 4.59713C11.915 7.01201 9.95732 8.96965 7.54244 8.96965C5.12757 8.96965 3.16992 7.01201 3.16992 4.59713Z"
                fill="currentColor"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              :class="{ 'transform rotate-180': userDropdownOpen }"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="userDropdownOpen || !isMobileOrTablet"
              class="absolute right-0 mt-3 w-48 bg-[#0E0E0E] border border-main-gray rounded-md shadow-lg py-1 z-[100] user-dropdown-menu hidden group-hover:block"
              :class="{ '!block': userDropdownOpen }"
            >
              <router-link
                to="/settings"
                class="block px-4 py-2 text-base transition-colors duration-200 text-main-gray-hover hover:text-main-red"
                :class="{ 'text-main-red': route.path === '/settings' }"
                @click="userDropdownOpen = false"
              >
                {{ $t("settings") }}
              </router-link>
              <router-link
                to="/orders"
                class="block px-4 py-2 text-base transition-colors duration-200 text-main-gray-hover hover:text-main-red"
                :class="{ 'text-main-red': route.path === '/orders' }"
                @click="userDropdownOpen = false"
              >
                {{ $t("orders") }}
              </router-link>
              <router-link
                v-if="authStore.isAdmin"
                to="/admin"
                class="block px-4 py-2 text-main-gray-hover hover:text-main-red transition-colors duration-200 text-base"
                @click="userDropdownOpen = false"
              >
                {{ $t("adminPanel") }}
              </router-link>
              <div class="border-t border-main-gray my-1"></div>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-main-gray-hover hover:text-main-red transition-colors duration-200 text-base"
              >
                {{ $t("logout") }}
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </nav>

  <!-- Spacer to prevent content from being hidden under fixed navbar on mobile/tablet -->
  <div v-if="isMobileOrTablet && !translationsLoading" class="h-[73px]"></div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import i18n from "@/i18n";
import { translationsLoaded, loadLocaleMessages } from "@/i18n";

import { useAuthStore } from "@/stores/authStore";

import { getCartItemsCount } from "@/services/cartService";

import { useEventBus } from "@/utils/eventBus";

// Composables Setup
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const { on, emit } = useEventBus();

// State Management
const cartItemsCount = ref<number>(0);
const mobileMenuOpen = ref<boolean>(false);
const isMobileOrTablet = ref<boolean>(false);
const userDropdownOpen = ref<boolean>(false);

// Check if device is mobile or tablet
const checkDeviceSize = (): void => {
  const width = window.innerWidth;
  isMobileOrTablet.value = width < 768;
};

// Watch for mobile menu state changes to control body scroll
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  } else {
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  }
});

// Computed Properties
const isCartPage = computed<boolean>(
  () => route.path === "/cart" || route.path === "/checkout"
);
const currentLanguage = computed<string>(() =>
  locale.value === "en" ? "EN" : "RU"
);
const translationsLoading = computed<boolean>(() => !translationsLoaded.value);

// Mobile Menu Management
const toggleMobileMenu = (): void => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = (): void => {
  mobileMenuOpen.value = false;
};

// Language Management
const toggleLanguage = async (): Promise<void> => {
  const newLanguage = locale.value === "en" ? "ru" : "en";

  // Update locale
  locale.value = newLanguage;
  sessionStorage.setItem("language", newLanguage);

  // Update i18n
  const messages = await loadLocaleMessages(newLanguage);
  i18n.global.setLocaleMessage(newLanguage, messages);

  // Emit event to notify components about language change
  emit("language-changed", newLanguage);
};

// Authentication Management
const handleLogout = async (): Promise<void> => {
  try {
    await authStore.logout();
    updateCartCount();
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

const handleLogoutAndCloseMobileMenu = async (): Promise<void> => {
  closeMobileMenu();
  await handleLogout();
};

// Cart Management
const updateCartCount = (): void => {
  cartItemsCount.value = getCartItemsCount();
};

// Lifecycle Hooks
onMounted(() => {
  updateCartCount();
  on("cart-updated", updateCartCount);
  checkDeviceSize();

  // Add window resize listener
  window.addEventListener("resize", checkDeviceSize);
});

// Clean up event listeners when component is unmounted
onUnmounted(() => {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";

  window.removeEventListener("resize", checkDeviceSize);
});
</script>
