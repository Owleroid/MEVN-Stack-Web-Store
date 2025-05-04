import axios from "axios";

import type {
  SupportMessage,
  SupportMessageInput,
  SupportMessageUpdate,
} from "@/types/support";

const apiUrl = import.meta.env.VITE_API_URL;

const supportService = axios.create({
  baseURL: `${apiUrl}/api/support`,
  withCredentials: true,
});

/**
 * Submit a new support message (public)
 */
export const submitSupportMessage = async (
  data: SupportMessageInput
): Promise<SupportMessage> => {
  const response = await supportService.post("/", data);
  return response.data;
};

/**
 * Get all support messages (admin only)
 */
export const getAllSupportMessages = async (
  page = 1,
  limit = 10,
  status?: string
): Promise<SupportMessage[]> => {
  const params: Record<string, string> = {
    page: page.toString(),
    limit: limit.toString(),
  };

  if (status) {
    params.status = status;
  }

  const response = await supportService.get("/", { params });

  // Extract the messages from the response structure
  if (
    response.data &&
    response.data.success &&
    Array.isArray(response.data.messages)
  ) {
    return response.data.messages;
  }

  // Fallback - return empty array if structure is unexpected
  console.error("Unexpected API response structure:", response.data);
  return [];
};

/**
 * Get a specific support message by ID (admin only)
 */
export const getSupportMessageById = async (
  id: string
): Promise<SupportMessage> => {
  const response = await supportService.get(`/${id}`);
  return response.data;
};

/**
 * Update a support message (admin only)
 */
export const updateSupportMessage = async (
  id: string,
  data: SupportMessageUpdate
): Promise<SupportMessage> => {
  const response = await supportService.put(`/${id}`, data);
  return response.data;
};

/**
 * Delete a support message (admin only)
 */
export const deleteSupportMessage = async (id: string): Promise<void> => {
  await supportService.delete(`/${id}`);
};

export default supportService;
