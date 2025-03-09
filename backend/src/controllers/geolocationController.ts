import axios from "axios";
import { Request, Response, NextFunction } from "express";

export const getUserLocation = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch the public IP address of the client
    const ipResponse = await axios.get("https://api64.ipify.org?format=json");
    const clientIp = ipResponse.data.ip;

    // Fetch the geolocation data using the public IP address
    const geoResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
    res.json(geoResponse.data);
  } catch (error) {
    next(error);
  }
};
