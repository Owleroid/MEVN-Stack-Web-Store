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

import MessageModal from "@/components/admin/support/MessageModal.vue";
import NewMessagesSection from "@/components/admin/support/NewMessagesSection.vue";
import AllMessagesSection from "@/components/admin/support/AllMessagesSection.vue";

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
    messages.value = []; // Ensure it's always an array
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
  selectedMessage.value = null;
  isResponding.value = false;
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

const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    await deleteSupportMessage(messageId);

    // Remove the message from the local state
    messages.value = messages.value.filter((msg) => msg._id !== messageId);

    toast.success(t("messageDeleted"));
    closeModal();
  } catch (err: unknown) {
    console.error("Error deleting message:", err);
    toast.error(t("deleteError"));
  }
};

// Lifecycle Hooks
onMounted(fetchMessages);

// Watchers
watch([sortOrder, statusFilter], () => {
  currentPage.value = 1; // Reset to page 1 when filters change
});
</script>
