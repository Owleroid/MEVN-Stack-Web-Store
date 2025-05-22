import fs from "fs";
import path from "path";
import mongoose from "mongoose";

import Warehouse, { WarehouseDocument } from "./WarehouseModel.js";

const countryToWarehousePath = path.resolve(
  "src/config/secrets/country-to-warehouse.json"
);

/**
 * Loads the mapping between countries and warehouses from the configuration file
 * @returns {Object.<string, string>} A mapping of country codes to warehouse names
 */
export const loadCountryToWarehouseMap = (): { [key: string]: string } => {
  if (!fs.existsSync(countryToWarehousePath)) {
    console.warn(
      `Warning: Configuration file "country-to-warehouse.json" not found.`
    );
    return {};
  }

  try {
    return JSON.parse(fs.readFileSync(countryToWarehousePath, "utf-8"));
  } catch (error: unknown) {
    console.error(
      `Error parsing "country-to-warehouse.json": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    return {};
  }
};

/**
 * Updates all warehouses with a new product
 * @param productId The ID of the product to add to warehouses
 * @param productName The name of the product
 * @param session Optional MongoDB session for transactions
 */
export const updateWarehousesWithNewProduct = async (
  productId: mongoose.Types.ObjectId | string,
  productName: string,
  session?: mongoose.ClientSession
) => {
  const query = Warehouse.find();
  if (session) {
    query.session(session);
  }
  const warehouses = await query;

  for (const warehouse of warehouses) {
    warehouse.products.push({
      product: new mongoose.Types.ObjectId(productId),
      name: productName,
      amount: 0,
    });

    if (session) {
      await warehouse.save({ session });
    } else {
      await warehouse.save();
    }
  }
};

/**
 * Removes a product from all warehouses
 * @param productId The ID of the product to remove
 * @param session Optional MongoDB session for transactions
 */
export const removeProductFromWarehouses = async (
  productId: mongoose.Types.ObjectId | string,
  session?: mongoose.ClientSession
) => {
  const updateOptions = session ? { session } : {};

  await Warehouse.updateMany(
    {},
    { $pull: { products: { product: productId } } },
    updateOptions
  );
};

/**
 * Gets a warehouse by ID
 * @param warehouseId The ID of the warehouse to find
 * @param session Optional MongoDB session for transactions
 * @returns The warehouse document or null if not found
 */
export const getWarehouseById = async (
  warehouseId: mongoose.Types.ObjectId | string,
  session?: mongoose.ClientSession
): Promise<WarehouseDocument | null> => {
  const query = Warehouse.findById(warehouseId);
  if (session) {
    query.session(session);
  }
  return query.exec();
};

/**
 * Gets a warehouse by name
 * @param warehouseName The name of the warehouse to find
 * @param session Optional MongoDB session for transactions
 * @returns The warehouse document or null if not found
 */
export const findWarehouseByName = async (
  warehouseName: string,
  session?: mongoose.ClientSession
): Promise<WarehouseDocument | null> => {
  const query = Warehouse.findOne({ name: warehouseName });
  if (session) {
    query.session(session);
  }
  return query.exec();
};

/**
 * Gets all warehouses
 * @param session Optional MongoDB session for transactions
 * @returns Array of warehouse documents
 */
export const getAllWarehouses = async (
  session?: mongoose.ClientSession
): Promise<WarehouseDocument[]> => {
  const query = Warehouse.find();
  if (session) {
    query.session(session);
  }
  return query.exec();
};

/**
 * Updates a product amount in a specific warehouse
 * @param warehouseId The ID of the warehouse
 * @param productId The ID of the product
 * @param amount The new amount
 * @param session Optional MongoDB session for transactions
 * @returns Updated warehouse document or null if not found
 */
export const updateProductAmountInWarehouse = async (
  warehouseId: mongoose.Types.ObjectId | string,
  productId: mongoose.Types.ObjectId | string,
  amount: number,
  session?: mongoose.ClientSession
): Promise<WarehouseDocument | null> => {
  const warehouse = await getWarehouseById(warehouseId, session);

  if (!warehouse) {
    return null;
  }

  const productIndex = warehouse.products.findIndex(
    (p) => p.product.toString() === productId.toString()
  );

  if (productIndex === -1) {
    return null;
  }

  warehouse.products[productIndex].amount = amount;

  if (session) {
    return warehouse.save({ session });
  } else {
    return warehouse.save();
  }
};

/**
 * Return products to warehouse (increase inventory)
 * @param warehouse The warehouse document
 * @param products Array of products with amounts to return
 * @param session Optional MongoDB session for transactions
 */
export const returnProductsToWarehouse = async (
  warehouse: WarehouseDocument,
  products: { productId: mongoose.Types.ObjectId | string; amount: number }[],
  session?: mongoose.ClientSession
): Promise<void> => {
  for (const product of products) {
    const { productId, amount } = product;

    const warehouseProduct = warehouse.products.find(
      (p) => p.product.toString() === productId.toString()
    );

    if (!warehouseProduct) {
      continue;
    }

    warehouseProduct.amount += amount;
  }

  if (session) {
    await warehouse.save({ session });
  } else {
    await warehouse.save();
  }
};

/**
 * Remove products from warehouse (decrease inventory)
 * @param warehouse The warehouse document
 * @param products Array of products with amounts to remove
 * @param session Optional MongoDB session for transactions
 */
export const removeProductsFromWarehouse = async (
  warehouse: WarehouseDocument,
  products: { productId: mongoose.Types.ObjectId | string; amount: number }[],
  session?: mongoose.ClientSession
): Promise<void> => {
  for (const product of products) {
    const { productId, amount } = product;

    const warehouseProduct = warehouse.products.find(
      (p) => p.product.toString() === productId.toString()
    );

    if (!warehouseProduct) {
      throw new Error(`Product ${productId} not found in warehouse`);
    }

    warehouseProduct.amount -= amount;
  }

  if (session) {
    await warehouse.save({ session });
  } else {
    await warehouse.save();
  }
};

/**
 * Update warehouse stock comparing existing and new product lists
 * @param existingProducts Existing products with amounts
 * @param newProducts New products with amounts
 * @param warehouse The warehouse document
 * @param session Optional MongoDB session for transactions
 */
export const updateWarehouseStock = async (
  existingProducts: {
    productId: mongoose.Types.ObjectId | string;
    amount: number;
  }[],
  newProducts: {
    productId: mongoose.Types.ObjectId | string;
    amount: number;
  }[],
  warehouse: WarehouseDocument,
  session?: mongoose.ClientSession
): Promise<void> => {
  const existingProductMap = new Map<string, number>();
  const updatedProductMap = new Map<string, number>();

  for (const { productId, amount } of existingProducts) {
    existingProductMap.set(productId.toString(), amount);
  }

  for (const { productId, amount } of newProducts) {
    updatedProductMap.set(productId.toString(), amount);
  }

  for (const [productId, newAmount] of updatedProductMap.entries()) {
    const oldAmount = existingProductMap.get(productId) || 0;
    const difference = newAmount - oldAmount;

    const warehouseProduct = warehouse.products.find(
      (p) => p.product.toString() === productId
    );

    if (!warehouseProduct) {
      throw new Error(`Product with ID "${productId}" not found in warehouse`);
    }

    warehouseProduct.amount -= difference;

    if (isNaN(warehouseProduct.amount)) {
      throw new Error(
        `Error updating stock: result is NaN for product ${productId}`
      );
    }
  }

  if (session) {
    await warehouse.save({ session });
  } else {
    await warehouse.save();
  }
};
