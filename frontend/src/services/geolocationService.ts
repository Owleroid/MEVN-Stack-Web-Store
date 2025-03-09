import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const geoService = axios.create({
  baseURL: `${apiUrl}/api/geo`,
  withCredentials: true,
});

export const getUserLocation = async () => {
  try {
    const response = await geoService.get("/location");
    const location = response.data;
    sessionStorage.setItem("userRegion", location.country_code);
    return location;
  } catch (error) {
    console.error("Error fetching user location:", error);
    return null;
  }
};

export const getUserRegion = () => {
  return sessionStorage.getItem("userRegion");
};
