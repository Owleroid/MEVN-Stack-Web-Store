import "dotenv/config";

import app from "./app.js";

import connectDB from "./config/db.js";

import { initializeWarehouses } from "./features/warehouses/initializeWarehouses.js";
import { startDiscountScheduler } from "./features/discount-manager/discountService.js";

const PORT = process.env.PORT || 3010;

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log("Database connected successfully.");

    // Initialize warehouses
    await initializeWarehouses();
    console.log("Warehouses initialized successfully");

    // Start the discount scheduler
    startDiscountScheduler();
    console.log("Discount scheduler started");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
