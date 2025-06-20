import cors from "cors";
import helmet from "helmet";
import express from "express";
import session from "express-session";
import mongoSanitize from "express-mongo-sanitize";

import corseConfig from "./config/cors.js";
import sessionConfig from "./config/session.js";

import newsRoutes from "./features/news/newsRoutes.js";
import userRoutes from "./features/users/userRoutes.js";
import orderRoutes from "./features/orders/orderRoutes.js";
import supportRoutes from "./features/support/supportRoutes.js";
import authRoutes from "./features/authorization/authRoutes.js";
import productRoutes from "./features/products/productRoutes.js";
import discountRoutes from "./features/discounts/discountRoutes.js";
import geoRoutes from "./features/geolocation-manager/geoRoutes.js";
import categoryRoutes from "./features/categories/categoryRoutes.js";
import warehouseRoutes from "./features/warehouses/warehouseRoutes.js";
import imageManagerRoutes from "./features/image-manager/imageManagerRoutes.js";
import announcementRoutes from "./features/announcements/announcementRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { sessionRefresh } from "./middleware/sessionRefresh.js";

const app = express();

app.use(helmet());
app.use(cors(corseConfig));
app.use(express.json());
app.use(mongoSanitize());
app.use(session(sessionConfig));
app.use(sessionRefresh);

app.use("/api/geo", geoRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/products", productRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/image-manager", imageManagerRoutes);
app.use("/api/announcements", announcementRoutes);

app.use(errorHandler);

export default app;
