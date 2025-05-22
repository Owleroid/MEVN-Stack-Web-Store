import mongoose from "mongoose";

import Discount, { IDiscount } from "./DiscountModel.js";

import type { ProductDocument } from "../products/ProductModel.js";
import type { OrderProduct } from "../orders/OrderModel.js";

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

/**
 * Get all discounts
 * @returns {Promise<Array>} All discounts sorted by creation date
 */
export const getAllDiscounts = async (): Promise<IDiscount[]> => {
  return Discount.find().sort({ createdAt: -1 });
};

/**
 * Get a discount by ID
 * @param {string} id - The discount ID
 * @returns {Promise<Object|null>} The discount or null if not found
 */
export const getDiscountById = async (
  id: string | mongoose.Types.ObjectId
): Promise<IDiscount | null> => {
  return Discount.findById(id);
};

/**
 * Create a new discount
 * @param {Object} discountData - The discount data
 * @returns {Promise<Object>} The created discount
 */
export const createDiscount = async (discountData: {
  name: string;
  description?: string;
  scope: "all" | "categories" | "products";
  targetModel?: "Category" | "Product";
  targetIds?: mongoose.Types.ObjectId[];
  discounts: {
    rubles: number;
    euros: number;
  };
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}): Promise<IDiscount> => {
  const newDiscount = new Discount(discountData);
  return newDiscount.save();
};

/**
 * Update a discount
 * @param {string} id - The discount ID
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object|null>} The updated discount or null if not found
 */
export const updateDiscount = async (
  id: string | mongoose.Types.ObjectId,
  updateData: Partial<Omit<IDiscount, "_id">>
): Promise<IDiscount | null> => {
  return Discount.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Toggle the active status of a discount
 * @param {string} id - The discount ID
 * @returns {Promise<Object|null>} The updated discount or null if not found
 */
export const toggleDiscountStatus = async (
  id: string | mongoose.Types.ObjectId
): Promise<IDiscount | null> => {
  const discount = await Discount.findById(id);

  if (!discount) {
    return null;
  }

  discount.isActive = !discount.isActive;
  return discount.save();
};

/**
 * Delete a discount
 * @param {string} id - The discount ID
 * @returns {Promise<Object|null>} The deleted discount or null if not found
 */
export const deleteDiscount = async (
  id: string | mongoose.Types.ObjectId
): Promise<IDiscount | null> => {
  return Discount.findByIdAndDelete(id);
};

/**
 * Get all active discounts (current date is between start and end date)
 * @returns {Promise<Array>} Active discounts
 */
export const getActiveDiscounts = async (): Promise<IDiscount[]> => {
  const currentDate = new Date();
  return Discount.find({
    isActive: true,
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  });
};

/**
 * Apply discounts to a product
 * @param {Object} product - The product
 * @param {Array} activeDiscounts - Active discounts
 * @returns {Object} Product with applied discount
 */
export const applyDiscountToProduct = (
  product: ProductDocument,
  activeDiscounts: IDiscount[]
): ProductWithDiscount => {
  const productWithDiscount = product.toObject
    ? product.toObject()
    : { ...product };

  if (activeDiscounts.length === 0) {
    return productWithDiscount;
  }

  const directProductDiscounts = activeDiscounts.filter(
    (discount) =>
      discount.scope === "products" &&
      discount.targetModel === "Product" &&
      discount.targetIds.some(
        (id) => id.toString() === productWithDiscount._id.toString()
      )
  );

  const categoryDiscounts = activeDiscounts.filter(
    (discount) =>
      discount.scope === "categories" &&
      discount.targetModel === "Category" &&
      discount.targetIds.some(
        (id) => id.toString() === productWithDiscount.category.toString()
      )
  );

  const globalDiscounts = activeDiscounts.filter(
    (discount) => discount.scope === "all"
  );

  const applicableDiscounts = [
    ...directProductDiscounts,
    ...categoryDiscounts,
    ...globalDiscounts,
  ];

  if (applicableDiscounts.length > 0) {
    let bestDiscount = applicableDiscounts[0];

    for (const discount of applicableDiscounts) {
      if (discount.discounts.rubles > bestDiscount.discounts.rubles) {
        bestDiscount = discount;
      }
    }

    const originalPrice = { ...productWithDiscount.price };
    const discountRubles =
      (originalPrice.rubles * bestDiscount.discounts.rubles) / 100;
    const discountEuros =
      (originalPrice.euros * bestDiscount.discounts.euros) / 100;

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

    productWithDiscount.price = {
      rubles: originalPrice.rubles - discountRubles,
      euros: originalPrice.euros - discountEuros,
    };
  }

  return productWithDiscount;
};

/**
 * Apply discounts to products
 * @param {Array} products - The products
 * @returns {Promise<Array>} Products with applied discounts
 */
export const applyDiscountsToProducts = async (
  products: ProductDocument[]
): Promise<ProductWithDiscount[]> => {
  const activeDiscounts = await getActiveDiscounts();

  if (activeDiscounts.length === 0) {
    return products as ProductWithDiscount[];
  }

  return products.map((product) =>
    applyDiscountToProduct(product, activeDiscounts)
  );
};

/**
 * Apply discount to a single product
 * @param {Object} product - The product
 * @returns {Promise<Object>} Product with applied discount
 */
export const applyDiscountToSingleProduct = async (
  product: ProductDocument
): Promise<ProductWithDiscount> => {
  const activeDiscounts = await getActiveDiscounts();

  if (activeDiscounts.length === 0) {
    return product as ProductWithDiscount;
  }

  return applyDiscountToProduct(product, activeDiscounts);
};

/**
 * Apply discounts to order products
 * @param {Array} orderProducts - Order products
 * @param {Map} productMap - Map of product ID to product
 * @returns {Promise<Array>} Order products with applied discounts
 */
export const applyDiscountsToOrderProducts = async (
  orderProducts: OrderProduct[],
  productMap: Map<string, ProductDocument>
): Promise<OrderProduct[]> => {
  const activeDiscounts = await getActiveDiscounts();

  if (activeDiscounts.length === 0) {
    return orderProducts;
  }

  return orderProducts.map((orderProduct) => {
    const product = productMap.get(orderProduct.productId.toString());

    if (!product) {
      return orderProduct;
    }

    const directProductDiscounts = activeDiscounts.filter(
      (discount) =>
        discount.scope === "products" &&
        discount.targetModel === "Product" &&
        discount.targetIds.some(
          (id) => id.toString() === orderProduct.productId.toString()
        )
    );

    const categoryDiscounts = activeDiscounts.filter(
      (discount) =>
        discount.scope === "categories" &&
        discount.targetModel === "Category" &&
        discount.targetIds.some(
          (id) => id.toString() === product.category.toString()
        )
    );

    const globalDiscounts = activeDiscounts.filter(
      (discount) => discount.scope === "all"
    );

    const applicableDiscounts = [
      ...directProductDiscounts,
      ...categoryDiscounts,
      ...globalDiscounts,
    ];

    if (applicableDiscounts.length > 0) {
      let bestDiscount = applicableDiscounts[0];

      for (const discount of applicableDiscounts) {
        if (discount.discounts.rubles > bestDiscount.discounts.rubles) {
          bestDiscount = discount;
        }
      }

      const originalPrice = orderProduct.productPrice;
      const discountAmount =
        (originalPrice * bestDiscount.discounts.rubles) / 100;

      return {
        ...orderProduct,
        productPrice: originalPrice - discountAmount,
        discount: {
          originalPrice: originalPrice,
          discountAmount: discountAmount,
          discountName: bestDiscount.name,
          discountId: bestDiscount._id,
          discountPercentage: bestDiscount.discounts.rubles,
        },
      };
    }

    return orderProduct;
  });
};
