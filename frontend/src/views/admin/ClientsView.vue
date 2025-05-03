<template>
  <div class="max-w-5xl mx-auto p-6">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <h1 class="text-2xl font-bold text-gray-800 m-0">
        {{ $t("pageTitle") }}
      </h1>
      <div class="w-full sm:w-72">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('search')"
          class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        />
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-12">
      <div
        class="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-600">{{ $t("loading") }}</p>
    </div>

    <div
      v-else-if="error"
      class="text-center p-8 bg-red-50 text-red-600 rounded-md my-4"
    >
      <p>{{ error }}</p>
      <button
        @click="fetchUsers"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        {{ $t("retry") }}
      </button>
    </div>

    <div v-else class="overflow-x-auto">
      <table
        class="w-full border-collapse shadow-sm rounded-md overflow-hidden"
      >
        <thead>
          <tr>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
            >
              {{ $t("columns.name") }}
            </th>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
            >
              {{ $t("columns.email") }}
            </th>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
            >
              {{ $t("columns.phone") }}
            </th>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
            >
              {{ $t("columns.registrationDate") }}
            </th>
            <th
              class="bg-gray-50 p-4 text-left font-semibold text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200"
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
            <td class="p-4 border-b border-gray-200">{{ formatName(user) }}</td>
            <td class="p-4 border-b border-gray-200">{{ user.email }}</td>
            <td class="p-4 border-b border-gray-200">
              {{ user.phone || $t("userInfo.notProvided") }}
            </td>
            <td class="p-4 border-b border-gray-200">
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

      <p
        v-if="sortedUsers.length === 0"
        class="text-center py-8 text-gray-500 italic"
      >
        {{ $t("noResults") }}
      </p>
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

import { getAllUsers } from "@/services/userService";

import UserDetailsModal from "@/components/admin/users/UserDetailsModal.vue";

import type { User } from "@/types/users";

const { t, locale } = useI18n();

// Reactive state
const users = ref<User[]>([]);
const loading = ref(true);
const error = ref("");
const searchQuery = ref("");
const selectedUser = ref<User | null>(null);
const showModal = ref(false);

// Computed properties
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

    // For users with same role, sort by registration date (newest first)
    return (
      new Date(b.registrationDate).getTime() -
      new Date(a.registrationDate).getTime()
    );
  });
});

// Methods
const fetchUsers = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAllUsers();
    users.value = response.data.users;
  } catch (err: any) {
    error.value = err.response?.data?.message || t("error");
    console.error("Error fetching users:", err);
  } finally {
    loading.value = false;
  }
};

const formatName = (user: User): string => {
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

const formatDate = (dateString: string): string => {
  if (!dateString) return t("userInfo.notProvided");

  const date = new Date(dateString);
  // Use locale-aware date formatting
  return new Intl.DateTimeFormat(locale.value === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// User details modal methods
const showUserDetails = (user: User) => {
  selectedUser.value = user;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// Lifecycle hooks
onMounted(fetchUsers);
</script>
