export interface Announcement {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    imageUrls: {
      main: string;
      secondary?: string[];
    };
    category: {
      _id?: string;
      slug: string;
    };
  };
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementInput {
  productId: string;
  imageUrl: string;
}

export interface UpdateAnnouncementStatus {
  isActive: boolean;
}

export interface UpdateAnnouncementImage {
  imageUrl: string;
}

export interface AnnouncementListResponse {
  success: boolean;
  announcements: Announcement[];
}

export interface AnnouncementResponse {
  success: boolean;
  announcement: Announcement;
}

export interface AnnouncementActionResponse {
  success: boolean;
  message?: string;
}
