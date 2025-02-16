import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import connectMongoDBSession from "connect-mongodb-session";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const MongoDBStore = connectMongoDBSession(session);
const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI!,
  collection: "sessions",
});

// Cors options
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

//app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Routes
app.use("/api/auth", authRoutes);

export default app;
