<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Users List Section -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <!-- Section Header with Search -->
        <div class="p-4 border-b border-gray-200">
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <h2 class="text-lg font-semibold text-gray-800">
              {{ $t("usersList") }}
            </h2>

            <!-- Search Input -->
            <div class="w-full sm:w-72">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="$t('search')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <div
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-2 top-2 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200"
                >
                  &times;
                </div>
              </div>
            </div>
          </div>
        </div>

        <transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <!-- Loading State -->
          <div
            v-if="loading"
            class="flex flex-col items-center justify-center py-16"
            key="loading"
          >
            <div
              class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
            ></div>
            <p class="text-gray-600">{{ $t("loading") }}</p>
          </div>

          <!-- Error State -->
          <div
            v-else-if="error"
            class="text-center p-8 bg-red-50 text-red-600 rounded-md m-4"
            key="error"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 mx-auto text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p>{{ error }}</p>
            <button
              @click="fetchUsers"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            >
              {{ $t("retry") }}
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="sortedUsers.length === 0"
            class="text-center py-16"
            key="empty"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p class="text-gray-500 text-lg mb-2">{{ $t("noResults") }}</p>
            <p class="text-gray-400 text-sm">{{ $t("tryAdjustingSearch") }}</p>
          </div>

          <!-- Users Table -->
          <div v-else class="overflow-x-auto" key="users-table">
            <table class="w-full border-collapse table-fixed">
              <thead>
                <tr>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-1/5"
                  >
                    {{ $t("columns.name") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-1/5"
                  >
                    {{ $t("columns.email") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-1/5"
                  >
                    {{ $t("columns.phone") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-1/5"
                  >
                    {{ $t("columns.registrationDate") }}
                  </th>
                  <th
                    class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200 w-1/5"
                  >
                    {{ $t("columns.role") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in sortedUsers"
                  :key="user._id"
                  :class="{ 'bg-orange-50': user.isAdmin }"
                  @click="showUserDetails(user)"
                  class="cursor-pointer hover:bg-gray-50 transition-all duration-200"
                >
                  <td class="p-4 border-b border-gray-200 truncate">
                    {{ formatName(user) }}
                  </td>
                  <td class="p-4 border-b border-gray-200 truncate">
                    {{ user.email }}
                  </td>
                  <td class="p-4 border-b border-gray-200 truncate">
                    {{ user.phone || $t("userInfo.notProvided") }}
                  </td>
                  <td class="p-4 border-b border-gray-200 whitespace-nowrap">
                    {{ formatDate(user.registrationDate) }}
                  </td>
                  <td class="p-4 border-b border-gray-200">
                    <span
                      :class="
                        user.isAdmin
                          ? 'bg-orange-500 text-white'
                          : 'bg-blue-500 text-white'
                      "
                      class="px-3 py-1 rounded-full text-xs font-semibold inline-block"
                    >
                      {{ user.isAdmin ? $t("roles.admin") : $t("roles.user") }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </transition>
      </div>
    </div>

    <!-- User Details Modal with Transition -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
      appear
    >
      <UserDetailsModal
        v-if="showModal"
        :show="showModal"
        :user="selectedUser"
        @close="closeModal"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import UserDetailsModal from "@/components/admin/users/UserDetailsModal.vue";

import type { UserData } from "@/types/auth";

import { getAllUsers } from "@/services/userService";

// Composables Setup
const { t, locale } = useI18n();
const toast = useToast();

// State Management
// Data state
const users = ref<UserData[]>([]);
const selectedUser = ref<UserData | null>(null);

// UI state
const loading = ref(true);
const error = ref("");
const searchQuery = ref("");
const showModal = ref(false);

// Computed Properties
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;

  const query = searchQuery.value.toLowerCase();
  return users.value.filter(
    (user) =>
      user.name?.toLowerCase().includes(query) ||
      user.surname?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query)
  );
});

const sortedUsers = computed(() => {
  return [...filteredUsers.value].sort((a, b) => {
    // Sort admins first
    if (a.isAdmin && !b.isAdmin) return -1;
    if (!a.isAdmin && b.isAdmin) return 1;

    // Handle cases where registration dates might be undefined
    let dateA: number;
    let dateB: number;

    if (a.registrationDate) {
      const dateObj =
        a.registrationDate instanceof Date
          ? a.registrationDate
          : new Date(a.registrationDate);
      dateA = isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();
    } else {
      dateA = 0;
    }

    if (b.registrationDate) {
      const dateObj =
        b.registrationDate instanceof Date
          ? b.registrationDate
          : new Date(b.registrationDate);
      dateB = isNaN(dateObj.getTime()) ? 0 : dateObj.getTime();
    } else {
      dateB = 0;
    }

    // Sort by registration date (newest first)
    return dateB - dateA;
  });
});

// Data Fetching
const fetchUsers = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAllUsers();
    users.value = response.users;
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : (err as any)?.response?.data?.message || t("error");
    error.value = errorMessage;
    toast.error(t("fetchUsersError"));
    console.error("Error fetching users:", err);
  } finally {
    loading.value = false;
  }
};

// Formatting Helpers
const formatName = (user: UserData): string => {
  if (user.name && user.surname) {
    return `${user.name} ${user.surname}`;
  } else if (user.name) {
    return user.name;
  } else if (user.surname) {
    return user.surname;
  } else {
    return t("userInfo.noName");
  }
};

const formatDate = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return t("userInfo.notProvided");

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  // Check if date is valid before formatting
  if (isNaN(date.getTime())) return t("userInfo.notProvided");

  return new Intl.DateTimeFormat(locale.value === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Modal Management
const showUserDetails = (user: UserData) => {
  selectedUser.value = user;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
};

// Lifecycle Hooks
onMounted(() => {
  fetchUsers();
});
</script>
