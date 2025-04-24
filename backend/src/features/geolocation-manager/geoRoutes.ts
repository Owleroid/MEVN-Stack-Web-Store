import express from "express";

import { getUserLocation } from "./geoController.js";

const router = express.Router();

router.get("/", getUserLocation);

export default router;
