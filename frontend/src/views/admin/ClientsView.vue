<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- Users List Section -->
    <div class="bg-white rounded-lg shadow border border-gray-200">
      <!-- Section Header with Search -->
      <div class="p-4 border-b border-gray-200">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <h1 class="text-xl font-semibold text-gray-800">
            {{ $t("usersList") }}
          </h1>

          <!-- Search Input (moved from header) -->
          <div class="w-full sm:w-72">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('search')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <div
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-2 top-2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                &times;
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center py-12"
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
      >
        <p>{{ error }}</p>
        <button
          @click="fetchUsers"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {{ $t("retry") }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="sortedUsers.length === 0" class="text-center py-12">
        <p class="text-gray-500">{{ $t("noResults") }}</p>
      </div>

      <!-- Users Table -->
      <div v-else class="overflow-x-auto">
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
              class="cursor-pointer hover:bg-gray-50 transition-colors"
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
    </div>

    <!-- User Details Modal -->
    <UserDetailsModal
      :show="showModal"
      :user="selectedUser"
      @close="closeModal"
    />
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
