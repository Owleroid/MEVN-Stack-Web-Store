import { OrderProduct } from "./OrderModel.js";

import { getProductsByIds } from "../products/productService.js";

import ApiError, { ErrorType } from "../../utils/apiError.js";

export const recalculateTotalPrice = async (
  updatedProducts: OrderProduct[],
  currency: "rubles" | "euros"
): Promise<number> => {
  try {
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
