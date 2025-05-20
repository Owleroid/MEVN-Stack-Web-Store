import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Discount from "./DiscountModel.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ProductDocument } from "../products/ProductModel.js";

export interface ProductWithDiscount extends ProductDocument {
  discount?: {
    originalPrice: {
      rubles: number;
      euros: number;
    };
    discountAmount: {
      rubles: number;
      euros: number;
    };
    discountName: string;
    discountId: mongoose.Types.ObjectId;
    endsAt: Date;
  };
}

// Define a type for the response body
interface ProductResponseBody {
  success: boolean;
  products?: ProductDocument[];
  product?: ProductDocument;
  [key: string]: any;
}

/**
 * Middleware that applies discounts to products in the response
 * This should be applied BEFORE the controller that handles the request
 */
export const applyDiscountsToProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🔍 Discount middleware initialized");

  // Store the original send method
  const originalSend = res.send;

  // Override the send method
  res.send = function (this: Response, body: any): Response {
    console.log("🔄 Intercepted response in discount middleware");

    try {
      // If the body is a string (likely JSON), parse it
      let parsedBody: ProductResponseBody | any = body;
      if (typeof body === "string") {
        try {
          parsedBody = JSON.parse(body);
          console.log("📄 Parsed JSON response body");
        } catch (e) {
          // Not JSON, continue with original response
          console.log("⚠️ Non-JSON response, bypassing discount processing");
          return originalSend.call(this, body);
        }
      }

      // Check if this is a product response
      if (
        parsedBody &&
        parsedBody.success &&
        (parsedBody.products || parsedBody.product)
      ) {
        console.log("✅ Found product data in response");

        // Process through a normal middleware function without blocking
        processDiscounts(parsedBody)
          .then((processedBody) => {
            console.log(
              "💰 Successfully applied discounts, sending modified response"
            );
            originalSend.call(this, JSON.stringify(processedBody));
          })
          .catch((error) => {
            console.error("❌ Error processing discounts:", error);
            originalSend.call(this, body);
          });

        return this; // Return this to maintain chainability
      } else {
        console.log("⏩ No product data found, sending original response");
      }

      return originalSend.call(this, body);
    } catch (error) {
      console.error("❌ Error in discount middleware:", error);
      return originalSend.call(this, body);
    }
  };

  next();
};

/**
 * Helper function to process discounts asynchronously
 */
const processDiscounts = async (
  body: ProductResponseBody
): Promise<ProductResponseBody> => {
  // Find all active discounts that are currently valid
  const currentDate = new Date();
  const activeDiscounts = await Discount.find({
    isActive: true,
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  });

  console.log(`📊 Found ${activeDiscounts.length} active discounts`);

  if (activeDiscounts.length === 0) {
    console.log("ℹ️ No active discounts found, returning original data");
    return body;
  }

  // Helper function to apply discounts to a single product
  const applyDiscountToProduct = (
    product: ProductDocument
  ): ProductWithDiscount => {
    // Clone the product to avoid modifying the original
    const productWithDiscount = product.toObject
      ? product.toObject()
      : { ...product };

    // Check for discounts that apply to this product directly
    const directProductDiscounts = activeDiscounts.filter(
      (discount) =>
        discount.scope === "products" &&
        discount.targetModel === "Product" &&
        discount.targetIds.some(
          (id) => id.toString() === productWithDiscount._id.toString()
        )
    );

    // Check for discounts that apply to this product's category
    const categoryDiscounts = activeDiscounts.filter(
      (discount) =>
        discount.scope === "categories" &&
        discount.targetModel === "Category" &&
        discount.targetIds.some(
          (id) => id.toString() === productWithDiscount.category.toString()
        )
    );

    // Check for global discounts that apply to all products
    const globalDiscounts = activeDiscounts.filter(
      (discount) => discount.scope === "all"
    );

    // Combine all applicable discounts and select the one with the highest discount
    const applicableDiscounts = [
      ...directProductDiscounts,
      ...categoryDiscounts,
      ...globalDiscounts,
    ];

    if (applicableDiscounts.length > 0) {
      console.log(
        `🏷️ Found ${applicableDiscounts.length} applicable discounts for product ${productWithDiscount.name}`
      );
      // Find the discount with the highest discount percentage
      let bestDiscount = applicableDiscounts[0];

      for (const discount of applicableDiscounts) {
        if (discount.discounts.rubles > bestDiscount.discounts.rubles) {
          bestDiscount = discount;
        }
      }

      // Apply the best discount
      const originalPrice = { ...productWithDiscount.price };
      const discountRubles =
        (originalPrice.rubles * bestDiscount.discounts.rubles) / 100;
      const discountEuros =
        (originalPrice.euros * bestDiscount.discounts.euros) / 100;

      console.log(
        `💲 Applying discount: ${bestDiscount.name} (${bestDiscount.discounts.rubles}% off)`
      );

      // Add discount information to the product
      productWithDiscount.discount = {
        originalPrice,
        discountAmount: {
          rubles: discountRubles,
          euros: discountEuros,
        },
        discountName: bestDiscount.name,
        discountId: bestDiscount._id,
        endsAt: bestDiscount.endDate,
      };

      // Update the price with the discount applied
      productWithDiscount.price = {
        rubles: originalPrice.rubles - discountRubles,
        euros: originalPrice.euros - discountEuros,
      };
    } else {
      console.log(
        `ℹ️ No applicable discounts for product ${productWithDiscount.name}`
      );
    }

    return productWithDiscount;
  };

  // Apply discounts based on what's in the response
  if (body.products && Array.isArray(body.products)) {
    body.products = body.products.map(applyDiscountToProduct);
    console.log(`✅ Applied discounts to ${body.products.length} products`);
  } else if (body.product) {
    body.product = applyDiscountToProduct(body.product);
    console.log(`✅ Applied discount to product ${body.product.name}`);
  }

  return body;
};
