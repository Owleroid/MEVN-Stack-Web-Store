export interface SupportMessage {
  _id: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  response?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessageInput {
  email: string;
  subject?: string;
  message: string;
}

export interface SupportMessageUpdate {
  status?: "new" | "in-progress" | "resolved";
  response?: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
