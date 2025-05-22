import { OrderProduct } from "./OrderModel.js";

import { getProductsByIds } from "../products/productService.js";
import type { ProductDocument } from "../products/ProductModel.js";

import ApiError, { ErrorType } from "../../utils/apiError.js";

/**
 * Recalculates the total price of an order based on updated products
 *
 * @param {OrderProduct[]} updatedProducts - Array of order products with updated quantities
 * @param {"rubles" | "euros"} currency - The currency to calculate the total price in
 * @returns {Promise<number>} The recalculated total price
 * @throws {ApiError} If products are not found or price calculation fails
 */
export const recalculateTotalPrice = async (
  updatedProducts: OrderProduct[],
  currency: "rubles" | "euros"
): Promise<number> => {
  try {
    const products = await fetchAndValidateProducts(updatedProducts);
    const productPriceMap = createProductPriceMap(products, currency);
    const totalPrice = calculateTotal(updatedProducts, productPriceMap);

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

/**
 * Fetches products by IDs and validates that all requested products exist
 *
 * @param {OrderProduct[]} updatedProducts - Array of order products
 * @returns {Promise<ProductDocument[]>} Array of product documents
 * @throws {ApiError} If any product is not found
 */
async function fetchAndValidateProducts(
  updatedProducts: OrderProduct[]
): Promise<ProductDocument[]> {
  const productIds = updatedProducts.map((product) => product.productId);
  const products = await getProductsByIds(productIds);

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

  return products;
}

/**
 * Creates a map of product IDs to their prices in the specified currency
 *
 * @param {ProductDocument[]} products - Array of product documents
 * @param {"rubles" | "euros"} currency - The currency to use for prices
 * @returns {Map<string, number>} Map of product IDs to prices
 */
function createProductPriceMap(
  products: ProductDocument[],
  currency: "rubles" | "euros"
): Map<string, number> {
  const productPriceMap = new Map<string, number>();

  products.forEach((product) => {
    const price =
      currency === "rubles" ? product.price.rubles : product.price.euros;
    productPriceMap.set(product._id.toString(), price);
  });

  return productPriceMap;
}

/**
 * Calculates the total price of products based on their quantities and prices
 *
 * @param {OrderProduct[]} orderProducts - Array of order products with quantities
 * @param {Map<string, number>} priceMap - Map of product IDs to prices
 * @returns {number} The calculated total price
 * @throws {ApiError} If price calculation fails
 */
function calculateTotal(
  orderProducts: OrderProduct[],
  priceMap: Map<string, number>
): number {
  const totalPrice = orderProducts.reduce((total, product) => {
    const productPrice = priceMap.get(product.productId.toString());

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
}
