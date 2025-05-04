<template>
  <div class="max-w-5xl mx-auto p-6">
    <!-- New Messages Section -->
    <NewMessagesSection
      :messages="newMessages"
      @view="viewMessage"
      @respond="respondToMessage"
    />

    <!-- All Messages Section -->
    <AllMessagesSection
      :messages="paginatedMessages"
      :loading="loading"
      :error="error"
      v-model:sortOrder="sortOrder"
      v-model:statusFilter="statusFilter"
      :currentPage="currentPage"
      :itemsPerPage="itemsPerPage"
      :totalItems="filteredMessages.length"
      @view="viewMessage"
      @respond="respondToMessage"
      @update:currentPage="currentPage = $event"
      @retry="fetchMessages"
    />

    <!-- Message Modal -->
    <MessageModal
      :show="showModal"
      :isResponding="isResponding"
      :message="selectedMessage"
      @close="closeModal"
      @submitResponse="submitResponse"
      @deleteMessage="deleteMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";

// Component imports
import MessageModal from "@/components/admin/support/MessageModal.vue";
import NewMessagesSection from "@/components/admin/support/NewMessagesSection.vue";
import AllMessagesSection from "@/components/admin/support/AllMessagesSection.vue";

// Type imports
import type { SupportMessage } from "@/types/support";

// Service imports
import {
  getAllSupportMessages,
  updateSupportMessage,
  deleteSupportMessage,
} from "@/services/supportService";

// ==============================
// Composables Setup
// ==============================
const { t } = useI18n();
const toast = useToast();

// ==============================
// State Management
// ==============================

// Data state
const messages = ref<SupportMessage[]>([]);
const selectedMessage = ref<SupportMessage | null>(null);
const loading = ref(true);
const error = ref("");

// UI state
const showModal = ref(false);
const isResponding = ref(false);
const sortOrder = ref("newest");
const statusFilter = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);

// ==============================
// Computed Properties
// ==============================

/**
 * Returns messages with "new" status
 */
const newMessages = computed(() => {
  return messages.value.filter((message) => message.status === "new");
});

/**
 * Returns filtered and sorted messages based on user selection
 * Excludes messages with "new" status since they are shown separately
 */
const filteredMessages = computed(() => {
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

/**
 * Returns paginated messages for the current page
 */
const paginatedMessages = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return filteredMessages.value.slice(
    startIndex,
    startIndex + itemsPerPage.value
  );
});

// ==============================
// Methods
// ==============================

/**
 * Fetches all support messages
 */
const fetchMessages = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await getAllSupportMessages();

    // Ensure we're working with an array
    if (Array.isArray(response)) {
      messages.value = response;
    } else if (response && Array.isArray(response)) {
      // If it's an axios response object
      messages.value = response;
    } else {
      console.error("Unexpected response format:", response);
      messages.value = []; // Default to empty array
      error.value = t("fetchMessagesError");
    }
  } catch (err) {
    console.error("Error fetching support messages:", err);
    messages.value = []; // Ensure it's always an array
    error.value = t("fetchMessagesError");
  } finally {
    loading.value = false;
  }
};

/**
 * Opens modal to view a message
 */
const viewMessage = (message: SupportMessage) => {
  selectedMessage.value = message;
  isResponding.value = false;
  showModal.value = true;
};

/**
 * Opens modal to respond to a message
 */
const respondToMessage = (message: SupportMessage) => {
  selectedMessage.value = message;
  isResponding.value = true;
  showModal.value = true;
};

/**
 * Closes the message modal
 */
const closeModal = () => {
  showModal.value = false;
  selectedMessage.value = null;
  isResponding.value = false;
};

/**
 * Submits a response to a message
 */
const submitResponse = async (
  messageId: string,
  response: string,
  status: "new" | "in-progress" | "resolved"
) => {
  try {
    await updateSupportMessage(messageId, { response, status });

    // Update the message in the local state
    const index = messages.value.findIndex((msg) => msg._id === messageId);
    if (index !== -1) {
      messages.value[index] = {
        ...messages.value[index],
        response,
        status,
      };
    }

    toast.success(t("responseSubmitted"));
    closeModal();
  } catch (err) {
    console.error("Error submitting response:", err);
    toast.error(t("responseError"));
  }
};

/**
 * Deletes a message
 */
const deleteMessage = async (messageId: string) => {
  try {
    await deleteSupportMessage(messageId);

    // Remove the message from the local state
    messages.value = messages.value.filter((msg) => msg._id !== messageId);

    toast.success(t("messageDeleted"));
    closeModal();
  } catch (err) {
    console.error("Error deleting message:", err);
    toast.error(t("deleteError"));
  }
};

// ==============================
// Lifecycle Hooks
// ==============================
onMounted(fetchMessages);

// ==============================
// Watchers
// ==============================

/**
 * Reset to page 1 when filters change
 */
watch([sortOrder, statusFilter], () => {
  currentPage.value = 1;
});
</script>
