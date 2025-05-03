import express from "express";

import { getAllUsers } from "./userController.js";

import { isAuthenticated, isAdmin } from "../authorization/authMiddleware.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllUsers);

export default router;
