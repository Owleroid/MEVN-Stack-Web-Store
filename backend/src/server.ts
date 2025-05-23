import "dotenv/config";

import app from "./app.js";

import connectDB from "./config/db.js";

import { initializeWarehouses } from "./features/warehouses/initializeWarehouses.js";

const PORT = process.env.PORT || 3010;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    await initializeWarehouses();
    console.log("Warehouses initialized successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
