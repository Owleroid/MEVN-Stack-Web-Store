/**
 * Support message status options
 */
export type SupportStatus = "new" | "in-progress" | "resolved";

/**
 * Support message data from API
 */
export interface SupportMessage {
  _id: string;
  email: string;
  subject: string;
  message: string;
  status: SupportStatus;
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data needed to create a new support message
 */
export interface SupportMessageInput {
  email: string;
  subject?: string;
  message: string;
}

/**
 * Data for updating a support message
 */
export interface SupportMessageUpdate {
  status?: SupportStatus;
  response?: string;
}

/**
 * Pagination data in API responses
 */
export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/**
 * Response structure for support messages list
 */
export interface SupportMessagesResponse {
  success: boolean;
  messages: SupportMessage[];
  pagination: PaginationData;
}
