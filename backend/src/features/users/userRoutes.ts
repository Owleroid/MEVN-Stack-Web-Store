import express from "express";

import { getAllUsersController } from "./userController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllUsersController);

export default router;
