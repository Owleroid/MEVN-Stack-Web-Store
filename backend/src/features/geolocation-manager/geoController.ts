import axios from "axios";
import { Request, Response, NextFunction } from "express";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";

export const getUserLocation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract the client's IP address from the request headers
    const clientIp =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] || // For proxies/load balancers
      req.socket.remoteAddress || // Fallback to direct connection IP
      "";

    if (!clientIp) {
      return next(new ApiError(400, "Unable to determine client IP address"));
    }

    try {
      // First try with ipapi.co
      try {
        const geoResponse = await axios.get(
          `https://ipapi.co/${clientIp}/json/`,
          {
            timeout: 3000, // Timeout to avoid long waits
          }
        );

        if (
          geoResponse.data &&
          !geoResponse.data.error &&
          geoResponse.data.country_code
        ) {
          return res.json(geoResponse.data);
        }
      } catch (error) {
        console.log("ipapi.co service failed, trying backup service");
      }

      // Backup service using ipinfo.io (requires token in production)
      try {
        const token = process.env.IPINFO_TOKEN || "";
        const ipinfoUrl = token
          ? `https://ipinfo.io/${clientIp}?token=${token}`
          : `https://ipinfo.io/${clientIp}`;

        const backupResponse = await axios.get(ipinfoUrl, {
          timeout: 3000,
        });

        if (backupResponse.data && backupResponse.data.country) {
          // Format response to match our GeoLocation interface
          const formattedResponse = {
            ip: clientIp,
            country_code: backupResponse.data.country,
            country_name: backupResponse.data.country,
            region: backupResponse.data.region || "",
            city: backupResponse.data.city || "",
            postal: backupResponse.data.postal || "",
            latitude: backupResponse.data.loc
              ? parseFloat(backupResponse.data.loc.split(",")[0])
              : 0,
            longitude: backupResponse.data.loc
              ? parseFloat(backupResponse.data.loc.split(",")[1])
              : 0,
            timezone: backupResponse.data.timezone || "",
          };

          return res.json(formattedResponse);
        }
      } catch (error) {
        console.log("Backup geolocation service failed");
      }

      // If both services fail, return an error to trigger the manual selection
      return next(new ApiError(503, "Geolocation services unavailable"));
    } catch (error) {
      return next(new ApiError(500, "Failed to determine geographic location"));
    }
  }
);
