import axios from "axios";
import { Request, Response, NextFunction } from "express";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";

export const getUserLocation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const clientIp = getClientIp(req);

    if (!clientIp) {
      return next(new ApiError(400, "Unable to determine client IP address"));
    }

    try {
      const primaryResult = await tryPrimaryGeoService(clientIp);
      if (primaryResult) {
        return res.json(primaryResult);
      }

      const backupResult = await tryBackupGeoService(clientIp);
      if (backupResult) {
        return res.json(backupResult);
      }

      return next(new ApiError(503, "Geolocation services unavailable"));
    } catch (error) {
      return next(new ApiError(500, "Failed to determine geographic location"));
    }
  }
);

function getClientIp(req: Request): string {
  return (
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    ""
  );
}

async function tryPrimaryGeoService(clientIp: string) {
  try {
    const geoResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`, {
      timeout: 3000,
    });

    if (
      geoResponse.data &&
      !geoResponse.data.error &&
      geoResponse.data.country_code
    ) {
      return geoResponse.data;
    }
    return null;
  } catch (error) {
    console.log("ipapi.co service failed, trying backup service");
    return null;
  }
}

async function tryBackupGeoService(clientIp: string) {
  try {
    const token = process.env.IPINFO_TOKEN || "";
    const ipinfoUrl = token
      ? `https://ipinfo.io/${clientIp}?token=${token}`
      : `https://ipinfo.io/${clientIp}`;

    const backupResponse = await axios.get(ipinfoUrl, {
      timeout: 3000,
    });

    if (backupResponse.data && backupResponse.data.country) {
      return {
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
    }
    return null;
  } catch (error) {
    console.log("Backup geolocation service failed");
    return null;
  }
}
