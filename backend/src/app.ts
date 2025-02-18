import cors from "cors";
import express from "express";
import session from "express-session";

import corseConfig from "./config/cors.js";
import sessionConfig from "./config/session.js";

import authRoutes from "./routes/authRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cors(corseConfig));
app.use(session(sessionConfig));

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
