import axios from "axios";
import type { AxiosResponse } from "axios";

import type {
  SupportMessage,
  SupportMessageInput,
  SupportMessageUpdate,
  SupportMessagesResponse,
  SupportStatus,
} from "@/types/support";

const apiUrl = import.meta.env.VITE_API_URL;

const supportService = axios.create({
  baseURL: `${apiUrl}/api/support`,
  withCredentials: true,
});

/**
 * Submit a new support message (public)
 * @param data - Support message data from user
 * @returns Promise resolving to created support message
 */
export const submitSupportMessage = async (
  data: SupportMessageInput
): Promise<SupportMessage> => {
  const response: AxiosResponse<{ success: boolean; message: SupportMessage }> =
    await supportService.post("/", data);
  return response.data.message;
};

/**
 * Get all support messages (admin only)
 * @param page - Page number to retrieve (default: 1)
 * @param limit - Number of items per page (default: 10)
 * @param status - Filter messages by status (optional)
 * @returns Promise resolving to messages and pagination data
 */
export const getAllSupportMessages = async (
  page = 1,
  limit = 10,
  status?: SupportStatus
): Promise<{
  messages: SupportMessage[];
  pagination: { total: number; pages: number };
}> => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (status) {
    params.status = status;
  }

  const response: AxiosResponse<SupportMessagesResponse> =
    await supportService.get("/", { params });

  return {
    messages: response.data.messages,
    pagination: {
      total: response.data.pagination.total,
      pages: response.data.pagination.pages,
    },
  };
};

/**
 * Get a specific support message by ID (admin only)
 * @param id - ID of the support message to retrieve
 * @returns Promise resolving to support message data
 */
export const getSupportMessageById = async (
  id: string
): Promise<SupportMessage> => {
  const response: AxiosResponse<{ success: boolean; message: SupportMessage }> =
    await supportService.get(`/${id}`);
  return response.data.message;
};

/**
 * Update a support message (admin only)
 * @param id - ID of the support message to update
 * @param data - Data to update (status and/or response)
 * @returns Promise resolving to updated support message
 */
export const updateSupportMessage = async (
  id: string,
  data: SupportMessageUpdate
): Promise<SupportMessage> => {
  const response: AxiosResponse<{ success: boolean; data: SupportMessage }> =
    await supportService.put(`/${id}`, data);
  return response.data.data;
};

/**
 * Delete a support message (admin only)
 * @param id - ID of the support message to delete
 * @returns Promise resolving when deletion is complete
 */
export const deleteSupportMessage = async (id: string): Promise<void> => {
  await supportService.delete(`/${id}`);
};

export default supportService;
