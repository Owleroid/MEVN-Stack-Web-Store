import cors from "cors";
import helmet from "helmet";
import express from "express";
import session from "express-session";
import mongoSanitize from "express-mongo-sanitize";

import corseConfig from "./config/cors.js";
import sessionConfig from "./config/session.js";

import geoRoutes from "./routes/geoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import orderRoutes from "./features/orders/orderRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());
app.use(cors(corseConfig));
app.use(express.json());
app.use(mongoSanitize());
app.use(session(sessionConfig));

app.use("/api/geo", geoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

export default app;
