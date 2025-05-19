import mongoose from "mongoose";

import Product from "./../products/ProductModel.js";
import { OrderDocument, OrderProduct } from "./OrderModel.js";
import { WarehouseDocument } from "./../warehouses/WarehouseModel.js";

import ApiError, { ErrorType } from "../../utils/apiError.js";

export const updateWarehouseStock = async (
  existingOrder: OrderDocument,
  updatedProducts: OrderProduct[],
  warehouse: WarehouseDocument,
  session: mongoose.ClientSession
): Promise<void> => {
  const existingProductMap = new Map<string, number>();
  existingOrder.products.forEach((product) => {
    existingProductMap.set(product.productId.toString(), product.amount);
  });

  const updatedProductMap = new Map<string, number>();
  updatedProducts.forEach((product) => {
    updatedProductMap.set(product.productId.toString(), product.amount);
  });

  for (const [productId, amount] of existingProductMap.entries()) {
    if (!updatedProductMap.has(productId)) {
      const warehouseProduct = warehouse.products.find(
        (p) => p.product.toString() === productId
      );
      if (warehouseProduct) {
        warehouseProduct.amount += amount;

        if (isNaN(warehouseProduct.amount)) {
          throw new ApiError(
            500,
            `Error updating stock: result is NaN for product ${productId}`,
            ErrorType.INTERNAL
          );
        }
      }
    }
  }

  for (const [productId, newAmount] of updatedProductMap.entries()) {
    const oldAmount = existingProductMap.get(productId) || 0;
    const difference = newAmount - oldAmount;

    const warehouseProduct = warehouse.products.find(
      (p) => p.product.toString() === productId
    );

    if (!warehouseProduct) {
      throw new ApiError(
        404,
        `Product with ID "${productId}" not found in warehouse`,
        ErrorType.RESOURCE_NOT_FOUND
      );
    }

    warehouseProduct.amount -= difference;

    if (isNaN(warehouseProduct.amount)) {
      throw new ApiError(
        500,
        `Error updating stock: result is NaN for product ${productId}`,
        ErrorType.INTERNAL
      );
    }
  }

  try {
    await warehouse.save({ session });
  } catch (error: unknown) {
    throw new ApiError(
      500,
      `Failed to update warehouse stock: ${
        error instanceof Error ? error.message : String(error)
      }`,
      ErrorType.INTERNAL
    );
  }
};

export const recalculateTotalPrice = async (
  updatedProducts: OrderProduct[],
  currency: "rubles" | "euros"
): Promise<number> => {
  try {
    const productIds = updatedProducts.map((product) => product.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p._id.toString());
      const missingIds = productIds.filter(
        (id) => !foundIds.includes(id.toString())
      );

      throw new ApiError(
        404,
        `Some products were not found: ${missingIds.join(", ")}`,
        ErrorType.RESOURCE_NOT_FOUND
      );
    }

    const productPriceMap = new Map<string, number>();
    products.forEach((product) => {
      const price =
        currency === "rubles" ? product.price.rubles : product.price.euros;
      productPriceMap.set(product._id.toString(), price);
    });

    const totalPrice = updatedProducts.reduce((total, product) => {
      const productPrice = productPriceMap.get(product.productId.toString());

      if (productPrice === undefined) {
        throw new ApiError(
          404,
          `Price not found for product: ${product.productId}`,
          ErrorType.RESOURCE_NOT_FOUND
        );
      }

      return total + product.amount * productPrice;
    }, 0);

    if (isNaN(totalPrice)) {
      throw new ApiError(
        500,
        "Error calculating total price: result is NaN",
        ErrorType.INTERNAL
      );
    }

    return totalPrice;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Failed to calculate total price: ${
        error instanceof Error ? error.message : String(error)
      }`,
      ErrorType.INTERNAL
    );
  }
};

export const returnProductsToWarehouse = async (
  products: OrderProduct[],
  warehouse: WarehouseDocument,
  session: mongoose.ClientSession
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

    if (isNaN(warehouseProduct.amount)) {
      throw new ApiError(
        500,
        `Error updating stock: result is NaN for product ${productId}`,
        ErrorType.INTERNAL
      );
    }
  }

  await warehouse.save({ session });
};

export const removeProductsFromWarehouse = async (
  products: OrderProduct[],
  warehouse: WarehouseDocument,
  session: mongoose.ClientSession
): Promise<void> => {
  for (const product of products) {
    const { productId, amount } = product;

    const warehouseProduct = warehouse.products.find(
      (p) => p.product.toString() === productId.toString()
    );

    if (!warehouseProduct) {
      throw new ApiError(
        400,
        `Product ${productId} not found in warehouse.`,
        ErrorType.BAD_REQUEST
      );
    }

    warehouseProduct.amount -= amount;

    if (isNaN(warehouseProduct.amount)) {
      throw new ApiError(
        500,
        `Error updating stock: result is NaN for product ${productId}`,
        ErrorType.INTERNAL
      );
    }
  }

  await warehouse.save({ session });
};
