import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const getUserLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the client's IP address from the request headers
    const clientIp =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] || // For proxies/load balancers
      req.socket.remoteAddress; // Fallback to direct connection IP

    if (!clientIp) {
      res.status(400).json({ error: "Unable to determine client IP address" });
      return;
    }

    // Fetch the geolocation data using the client's IP address
    const geoResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    res.json(geoResponse.data);
  } catch (error) {
    next(error);
  }
};
