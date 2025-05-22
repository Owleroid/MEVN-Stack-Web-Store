import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Discount from "./DiscountModel.js";
import { OrderProduct } from "../orders/OrderModel.js";
import Product, { ProductDocument } from "../products/ProductModel.js";

import { asyncHandler } from "../../utils/asyncHandlers.js";

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

interface ProductResponseBody {
  success: boolean;
  products?: ProductDocument[];
  product?: ProductDocument;
  [key: string]: any;
}

export const applyDiscountsToProducts = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send;

  res.send = function (this: Response, body: any): Response {
    try {
      let parsedBody: ProductResponseBody | any = body;
      if (typeof body === "string") {
        try {
          parsedBody = JSON.parse(body);
        } catch (e) {
          return originalSend.call(this, body);
        }
      }

      if (
        parsedBody &&
        parsedBody.success &&
        (parsedBody.products || parsedBody.product)
      ) {
        processDiscounts(parsedBody)
          .then((processedBody) => {
            originalSend.call(this, JSON.stringify(processedBody));
          })
          .catch((error) => {
            originalSend.call(this, body);
          });

        return this;
      }

      return originalSend.call(this, body);
    } catch (error) {
      return originalSend.call(this, body);
    }
  };

  next();
};

const processDiscounts = async (
  body: ProductResponseBody
): Promise<ProductResponseBody> => {
  const currentDate = new Date();
  const activeDiscounts = await Discount.find({
    isActive: true,
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  });

  if (activeDiscounts.length === 0) {
    return body;
  }

  const applyDiscountToProduct = (
    product: ProductDocument
  ): ProductWithDiscount => {
    const productWithDiscount = product.toObject
      ? product.toObject()
      : { ...product };

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

  if (body.products && Array.isArray(body.products)) {
    body.products = body.products.map(applyDiscountToProduct);
  } else if (body.product) {
    body.product = applyDiscountToProduct(body.product);
  }

  return body;
};

export const applyDiscountsToOrders = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (
      req.method === "POST" &&
      req.body &&
      req.body.products &&
      Array.isArray(req.body.products)
    ) {
      try {
        const productIds = req.body.products.map(
          (product: OrderProduct) => product.productId
        );

        const productDocuments = await Product.find({
          _id: { $in: productIds },
        });

        const productMap = new Map<string, ProductDocument>();
        productDocuments.forEach((product) => {
          productMap.set(product._id.toString(), product);
        });

        const currentDate = new Date();
        const activeDiscounts = await Discount.find({
          isActive: true,
          startDate: { $lte: currentDate },
          endDate: { $gte: currentDate },
        });

        if (activeDiscounts.length === 0) {
          return next();
        }

        for (let i = 0; i < req.body.products.length; i++) {
          const orderProduct = req.body.products[i];
          const product = productMap.get(orderProduct.productId.toString());

          if (!product) {
            continue;
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

            req.body.products[i] = {
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
        }

        if (req.body.totalPrice !== undefined) {
          let newTotalPrice = 0;

          req.body.products.forEach((product: OrderProduct) => {
            newTotalPrice += product.productPrice * product.amount;
          });

          req.body.totalPrice = newTotalPrice;
        }
      } catch (error) {}
    }

    next();
  }
);
