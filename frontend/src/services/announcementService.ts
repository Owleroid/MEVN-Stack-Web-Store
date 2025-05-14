import axios from "axios";
import type { AxiosResponse } from "axios";

import type {
  AnnouncementInput,
  UpdateAnnouncementStatus,
  UpdateAnnouncementImage,
  AnnouncementListResponse,
  AnnouncementResponse,
  AnnouncementActionResponse,
} from "@/types/announcement";

const apiUrl = import.meta.env.VITE_API_URL;

const announcementService = axios.create({
  baseURL: `${apiUrl}/api/announcements`,
  withCredentials: true,
});

// ------------------------------------------------
// PUBLIC ENDPOINTS - No authentication required
// ------------------------------------------------

/**
 * Retrieves all active announcements for public display
 * @returns Promise resolving to list of active announcements
 */
export const getActiveAnnouncements =
  async (): Promise<AnnouncementListResponse> => {
    const response: AxiosResponse<AnnouncementListResponse> =
      await announcementService.get("/active");
    return response.data;
  };

// ------------------------------------------------
// ADMIN ENDPOINTS - Require admin authentication
// ------------------------------------------------

/**
 * Retrieves all announcements (active and inactive) for admin
 * @returns Promise resolving to list of all announcements
 */
export const getAllAnnouncements =
  async (): Promise<AnnouncementListResponse> => {
    const response: AxiosResponse<AnnouncementListResponse> =
      await announcementService.get("/");
    return response.data;
  };

/**
 * Retrieves a specific announcement by ID
 * @param id - The ID of the announcement to fetch
 * @returns Promise resolving to the announcement data
 */
export const getAnnouncementById = async (
  id: string
): Promise<AnnouncementResponse> => {
  const response: AxiosResponse<AnnouncementResponse> =
    await announcementService.get(`/${id}`);
  return response.data;
};

/**
 * Creates a new announcement
 * @param announcementData - The announcement data to create
 * @returns Promise resolving to creation result
 */
export const createAnnouncement = async (
  announcementData: AnnouncementInput
): Promise<AnnouncementResponse> => {
  const response: AxiosResponse<AnnouncementResponse> =
    await announcementService.post("/", announcementData);
  return response.data;
};

/**
 * Updates an announcement's active status
 * @param id - The ID of the announcement to update
 * @param statusData - The updated status data (active/inactive)
 * @returns Promise resolving to update result
 */
export const updateAnnouncementStatus = async (
  id: string,
  statusData: UpdateAnnouncementStatus
): Promise<AnnouncementResponse> => {
  const response: AxiosResponse<AnnouncementResponse> =
    await announcementService.post(`/${id}/status`, statusData);
  return response.data;
};

/**
 * Updates an announcement's image
 * @param id - The ID of the announcement to update
 * @param imageData - The updated image URL
 * @returns Promise resolving to update result
 */
export const updateAnnouncementImage = async (
  id: string,
  imageData: UpdateAnnouncementImage
): Promise<AnnouncementResponse> => {
  const response: AxiosResponse<AnnouncementResponse> =
    await announcementService.post(`/${id}/image`, imageData);
  return response.data;
};

/**
 * Deletes an announcement
 * @param id - The ID of the announcement to delete
 * @returns Promise resolving to deletion result
 */
export const deleteAnnouncement = async (
  id: string
): Promise<AnnouncementActionResponse> => {
  const response: AxiosResponse<AnnouncementActionResponse> =
    await announcementService.delete(`/${id}`);
  return response.data;
};

export default announcementService;
