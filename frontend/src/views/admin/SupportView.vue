<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- New Messages Section -->
      <div
        v-if="newMessages.length > 0"
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800 flex items-center">
            {{ $t("newMessages") }}
            <span
              class="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full"
            >
              {{ newMessages.length }}
            </span>
          </h2>
        </div>

        <!-- Message Table -->
        <MessageTable
          :messages="newMessages"
          @view="viewMessage"
          @respond="respondToMessage"
        />
      </div>

      <!-- All Messages Section -->
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div class="p-4 border-b border-gray-200">
          <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4"
          >
            <h2 class="text-lg font-semibold text-gray-800">
              {{ $t("allMessages") }}
            </h2>
          </div>

          <!-- Filter Controls -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            <!-- Sort Order Filter -->
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <label
                for="sortOrder"
                class="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                {{ $t("sortByDate") }}:
              </label>
              <div class="relative w-full sm:w-auto">
                <select
                  v-model="sortOrder"
                  id="sortOrder"
                  class="appearance-none mt-1 block w-full sm:w-auto min-w-[180px] py-2 px-3 pr-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="newest">{{ $t("newestToOldest") }}</option>
                  <option value="oldest">{{ $t("oldestToNewest") }}</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <svg
                    class="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Status Filter -->
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <label
                for="statusFilter"
                class="text-sm font-medium text-gray-700 whitespace-nowrap"
              >
                {{ $t("filterByStatus") }}:
              </label>
              <div class="relative w-full sm:w-auto">
                <select
                  v-model="statusFilter"
                  id="statusFilter"
                  class="appearance-none mt-1 block w-full sm:w-auto min-w-[180px] py-2 px-3 pr-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="">{{ $t("all") }}</option>
                  <option value="in-progress">{{ $t("inProgress") }}</option>
                  <option value="resolved">{{ $t("resolved") }}</option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                >
                  <svg
                    class="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message List Content Area with Transitions -->
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
              @click="fetchMessages"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 shadow-sm"
            >
              {{ $t("retry") }}
            </button>
          </div>

          <!-- No Messages State -->
          <div
            v-else-if="filteredMessages.length === 0"
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p class="text-gray-500 text-lg mb-2">
              {{ $t("noMessagesFound") }}
            </p>
          </div>

          <!-- Messages Table -->
          <div v-else class="overflow-x-auto" key="messages-table">
            <MessageTable
              :messages="paginatedMessages"
              @view="viewMessage"
              @respond="respondToMessage"
            />
          </div>
        </transition>

        <!-- Pagination -->
        <Pagination
          v-if="filteredMessages.length > 0 && !loading && !error"
          :currentPage="currentPage"
          :totalItems="filteredMessages.length"
          :itemsPerPage="itemsPerPage"
          @update:currentPage="currentPage = $event"
          class="border-t border-gray-200"
        />
      </div>
    </div>
  </div>

  <!-- Message Modal with Transition -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    appear
  >
    <MessageModal
      v-if="showModal"
      :show="showModal"
      :isResponding="isResponding"
      :message="selectedMessage"
      @close="closeModal"
      @submitResponse="submitResponse"
      @deleteMessage="deleteMessage"
    />
  </transition>

  <!-- Delete Confirmation Modal with Transition -->
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    appear
  >
    <div
      v-if="showDeleteConfirmation"
      class="fixed inset-0 z-20 flex items-center justify-center overflow-auto bg-black/50"
      @click="showDeleteConfirmation = false"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        @click.stop
      >
        <h3 class="text-lg font-bold text-gray-900 mb-3">
          {{ $t("confirmDelete") }}
        </h3>

        <div class="text-gray-700 mb-6">
          {{ $t("deleteConfirmMessage") }}
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirmation = false"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-sm"
          >
            {{ $t("cancel") }}
          </button>
          <button
            @click="handleDeleteConfirm"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
          >
            {{ $t("delete") }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

import MessageModal from "@/components/admin/support/MessageModal.vue";
import MessageTable from "@/components/admin/support/MessageTable.vue";
import Pagination from "@/components/admin/support/Pagination.vue";

import type {
  SupportMessage,
  SupportStatus,
  SupportMessageUpdate,
} from "@/types/support";

import {
  getAllSupportMessages,
  updateSupportMessage,
  deleteSupportMessage,
} from "@/services/supportService";

// Composables Setup
const { t } = useI18n();
const toast = useToast();

// State Management
// Data state
const messages = ref<SupportMessage[]>([]);
const selectedMessage = ref<SupportMessage | null>(null);
const loading = ref(true);
const error = ref("");

// UI state
const showModal = ref(false);
const isResponding = ref(false);
const sortOrder = ref<"newest" | "oldest">("newest");
const statusFilter = ref<SupportStatus | "">("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showDeleteConfirmation = ref(false);
const messageToDelete = ref<string | null>(null);

// Computed Properties
const newMessages = computed((): SupportMessage[] => {
  return messages.value.filter((message) => message.status === "new");
});

const filteredMessages = computed((): SupportMessage[] => {
  // Exclude messages with "new" status
  let filtered = messages.value.filter((message) => message.status !== "new");

  // Apply status filter if selected
  if (statusFilter.value) {
    filtered = filtered.filter(
      (message) => message.status === statusFilter.value
    );
  }

  // Apply sort order
  if (sortOrder.value === "newest") {
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else {
    filtered = filtered.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  return filtered;
});

const paginatedMessages = computed((): SupportMessage[] => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filteredMessages.value.slice(
    startIndex,
    startIndex + itemsPerPage.value
  );
});

// Methods
const fetchMessages = async (): Promise<void> => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAllSupportMessages();
    messages.value = response.messages;
  } catch (err: unknown) {
    console.error("Error fetching support messages:", err);
    messages.value = [];
    error.value = t("fetchMessagesError");
  } finally {
    loading.value = false;
  }
};

const viewMessage = (message: SupportMessage): void => {
  selectedMessage.value = message;
  isResponding.value = false;
  showModal.value = true;
};

const respondToMessage = (message: SupportMessage): void => {
  selectedMessage.value = message;
  isResponding.value = true;
  showModal.value = true;
};

const closeModal = (): void => {
  showModal.value = false;

  // Reset internal state after transition has completed
  setTimeout(() => {
    selectedMessage.value = null;
    isResponding.value = false;
  }, 300);
};

const confirmDeleteMessage = (messageId: string): void => {
  messageToDelete.value = messageId;
  showDeleteConfirmation.value = true;
};

const handleDeleteConfirm = async (): Promise<void> => {
  if (!messageToDelete.value) return;

  try {
    await deleteSupportMessage(messageToDelete.value);

    // Remove the message from the local state
    messages.value = messages.value.filter(
      (msg) => msg._id !== messageToDelete.value
    );

    toast.success(t("messageDeleted"));
    showDeleteConfirmation.value = false;
    closeModal();
  } catch (err: unknown) {
    console.error("Error deleting message:", err);
    toast.error(t("deleteError"));
  }
};

const submitResponse = async (
  messageId: string,
  response: string,
  status: SupportStatus
): Promise<void> => {
  try {
    const updateData: SupportMessageUpdate = {
      response,
      status,
    };

    const updatedMessage = await updateSupportMessage(messageId, updateData);

    // Update the message in the local state
    const index = messages.value.findIndex((msg) => msg._id === messageId);
    if (index !== -1) {
      messages.value[index] = updatedMessage;
    }

    toast.success(t("responseSubmitted"));
    closeModal();
  } catch (err: unknown) {
    console.error("Error submitting response:", err);
    toast.error(t("responseError"));
  }
};

const deleteMessage = (messageId: string): Promise<void> => {
  confirmDeleteMessage(messageId);
  return Promise.resolve();
};

// Lifecycle Hooks
onMounted(fetchMessages);

// Watchers
watch([sortOrder, statusFilter], () => {
  currentPage.value = 1;
});
</script>
