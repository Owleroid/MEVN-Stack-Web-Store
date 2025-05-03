<template>
  <div class="clients-container">
    <div class="header">
      <h1>{{ $t("pageTitle") }}</h1>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="$t('search')"
          class="search-input"
        />
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ $t("loading") }}</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchUsers" class="retry-button">
        {{ $t("retry") }}
      </button>
    </div>

    <div v-else class="table-responsive">
      <table class="users-table">
        <thead>
          <tr>
            <th>{{ $t("columns.name") }}</th>
            <th>{{ $t("columns.email") }}</th>
            <th>{{ $t("columns.phone") }}</th>
            <th>{{ $t("columns.registrationDate") }}</th>
            <th>{{ $t("columns.role") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in sortedUsers"
            :key="user._id"
            :class="{ 'admin-row': user.isAdmin }"
            @click="showUserDetails(user)"
            class="clickable-row"
          >
            <td>{{ formatName(user) }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone || $t("userInfo.notProvided") }}</td>
            <td>{{ formatDate(user.registrationDate) }}</td>
            <td>
              <span :class="user.isAdmin ? 'admin-badge' : 'user-badge'">
                {{ user.isAdmin ? $t("roles.admin") : $t("roles.user") }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="sortedUsers.length === 0" class="no-results">
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

const { t, locale } = useI18n();

interface DeliveryData {
  country?: string;
  city?: string;
  street?: string;
  buildingNumber?: string;
  apartment?: string;
  postalCode?: string;
}

interface User {
  _id: string;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  registrationDate: string;
  isAdmin?: boolean;
  deliveryData?: DeliveryData;
}

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

<style scoped>
.clients-container {
  padding: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
}

.search-container {
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e2e8f0;
  border-radius: 50%;
  border-top-color: #4299e1;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-container {
  text-align: center;
  padding: 2rem;
  color: #e53e3e;
  background-color: #fff5f5;
  border-radius: 0.375rem;
  margin: 1rem 0;
}

.retry-button {
  background-color: #4299e1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #3182ce;
}

.table-responsive {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-radius: 0.375rem;
  overflow: hidden;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.users-table th {
  background-color: #f7fafc;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.users-table tr:last-child td {
  border-bottom: none;
}

.users-table tr:hover td {
  background-color: #f7fafc;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #718096;
  font-style: italic;
}

.admin-row {
  background-color: rgba(237, 242, 247, 0.7);
}

.admin-row:hover td {
  background-color: rgba(237, 242, 247, 0.9) !important;
}

.admin-badge,
.user-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.admin-badge {
  background-color: #ed8936;
  color: white;
}

.user-badge {
  background-color: #4299e1;
  color: white;
}

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.clickable-row:hover {
  background-color: rgba(237, 242, 247, 0.5);
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search-container {
    width: 100%;
  }

  .users-table th,
  .users-table td {
    padding: 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
