import fs from "fs";
import path from "path";

import Product from "../features/products/ProductModel.js";
import Warehouse from "../models/Warehouse.js";

const warehousesConfigPath = path.resolve(
  "src/config/secrets/warehouses-init.json"
);

const loadWarehouseConfig = (): string[] => {
  if (!fs.existsSync(warehousesConfigPath)) {
    console.warn(
      `Warning: Configuration file "warehouses-init.json" not found. No warehouses will be initialized.`
    );
    return [];
  }

  try {
    const warehousesConfig = JSON.parse(
      fs.readFileSync(warehousesConfigPath, "utf-8")
    );

    // Return the array of warehouse names directly
    return warehousesConfig.warehouses || [];
  } catch (error) {
    console.error(
      `Error parsing "warehouses-init.json": ${
        (error as Error).message
      }. No warehouses will be initialized.`
    );
    return [];
  }
};

export const initializeWarehouses = async () => {
  const warehouseNames = loadWarehouseConfig();

  if (warehouseNames.length === 0) {
    console.warn(
      `Warning: No warehouses specified in "warehouses-init.json". No warehouses will be initialized.`
    );
    return;
  }

  const products = await Product.find().select("_id name");

  if (products.length === 0) {
    console.warn(
      "No products found in the database. Warehouses will be initialized without products."
    );
  }

  const productsWithAmount = products.map((product) => ({
    product: product._id,
    name: product.name,
    amount: 0,
  }));

  for (const name of warehouseNames) {
    const existingWarehouse = await Warehouse.findOne({ name });
    if (!existingWarehouse) {
      await Warehouse.create({ name, products: productsWithAmount });
      console.log(`Warehouse "${name}" initialized with products.`);
    } else {
      console.log(`Warehouse "${name}" already exists in the database.`);
    }
  }
};
