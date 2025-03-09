import express from "express";

import { getUserLocation } from "../controllers/geolocationController.js";

const router = express.Router();

router.get("/location", getUserLocation);

export default router;
