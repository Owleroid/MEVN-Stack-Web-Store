import axios from "axios";
import type { AxiosResponse } from "axios";

import type { GeoLocation } from "@/types/geo";

const apiUrl = import.meta.env.VITE_API_URL;

const geoService = axios.create({
  baseURL: `${apiUrl}/api/geo`,
  withCredentials: true,
});

/**
 * Key used to store user's region in session storage
 */
export const USER_REGION_KEY = "userRegion";

/**
 * Fetches the user's geolocation data based on their IP address
 * Using the hybrid approach with multiple API services and fallback
 * @returns Promise resolving to the user's geolocation data or null if an error occurs
 */
export const getUserLocation = async (): Promise<GeoLocation | null> => {
  try {
    const response: AxiosResponse<GeoLocation> = await geoService.get("/");
    const location = response.data;

    // Store the user's country code in session storage for easy access
    if (location && location.country_code) {
      sessionStorage.setItem(USER_REGION_KEY, location.country_code);
      return location;
    }
    throw new Error("Invalid location data");
  } catch (error) {
    console.error("Error fetching user location:", error);
    return null;
  }
};

/**
 * Retrieves the user's region (country code) from session storage
 * @returns The user's country code or null if not available
 */
export const getUserRegion = (): string | null => {
  return sessionStorage.getItem(USER_REGION_KEY);
};

/**
 * Manually sets the user's region
 * @param region The region code to set
 */
export const setUserRegion = (region: string): void => {
  sessionStorage.setItem(USER_REGION_KEY, region);
};

export default geoService;
