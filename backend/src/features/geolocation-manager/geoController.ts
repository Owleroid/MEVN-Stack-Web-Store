import axios from "axios";
import { Request, Response, NextFunction } from "express";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getUserLocation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract the client's IP address from the request headers
    const clientIp =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] || // For proxies/load balancers
      req.socket.remoteAddress; // Fallback to direct connection IP

    if (!clientIp) {
      return next(new ApiError(400, "Unable to determine client IP address"));
    }

    // Fetch the geolocation data using the client's IP address
    const geoResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    res.json(geoResponse.data);
  }
);
