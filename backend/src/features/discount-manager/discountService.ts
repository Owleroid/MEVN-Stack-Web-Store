import mongoose from "mongoose";
import cron from "node-cron";

import Discount from "./DiscountModel.js";
import Product from "../products/ProductModel.js";
import { IDiscountPrice, IDiscountBasicInfo } from "./DiscountModel.js";

export const startDiscountScheduler = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      await deactivateExpiredDiscounts();
    } catch (error) {
      console.error("Error in discount scheduler:", error);
    }
  });
};

function getCurrentTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;
}

async function deactivateExpiredDiscounts() {
  const now = new Date();

  await Discount.updateMany(
    {
      isActive: true,
      endDate: { $lt: now },
    },
    {
      isActive: false,
    }
  );
}

export async function getBestActiveDiscount(
  productId: mongoose.Types.ObjectId,
  currency: "RUB" | "EUR"
): Promise<IDiscountBasicInfo | null> {
  const now = new Date();
  const currentTime = getCurrentTime();

  const product = await Product.findById(productId);
  if (!product) return null;

  const discounts = await Discount.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $or: [
      { targetType: "all" },
      { targetType: "products", products: productId },
      { targetType: "categories", categories: product.category },
    ],
  }).sort({ "discountPrices.percentage": -1 });

  let bestDiscount: IDiscountBasicInfo | null = null;
  let highestPercentage = 0;

  for (const discount of discounts) {
    if (discount.startTime && discount.endTime) {
      if (discount.startTime <= discount.endTime) {
        if (
          currentTime < discount.startTime ||
          currentTime > discount.endTime
        ) {
          continue;
        }
      } else {
        if (
          currentTime < discount.startTime &&
          currentTime > discount.endTime
        ) {
          continue;
        }
      }
    }

    const discountPrice = discount.discountPrices.find(
      (dp: IDiscountPrice) => dp.currency === currency
    );

    if (discountPrice && discountPrice.percentage > highestPercentage) {
      highestPercentage = discountPrice.percentage;
      bestDiscount = {
        percentage: discountPrice.percentage,
        startDate: discount.startDate,
        endDate: discount.endDate,
        startTime: discount.startTime,
        endTime: discount.endTime,
      };
    }
  }

  return bestDiscount;
}

export async function getAllActiveDiscountsForProduct(productId: string) {
  const now = new Date();
  const currentTime = getCurrentTime();

  const product = await Product.findById(productId);
  if (!product) return [];

  const discounts = await Discount.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $or: [
      { targetType: "all" },
      { targetType: "products", products: productId },
      { targetType: "categories", categories: product.category },
    ],
  })
    .populate("categories", "name slug")
    .populate("products", "name slug");

  return discounts.filter((discount) => {
    if (discount.startTime && discount.endTime) {
      if (discount.startTime <= discount.endTime) {
        return (
          currentTime >= discount.startTime && currentTime <= discount.endTime
        );
      } else {
        return (
          currentTime >= discount.startTime || currentTime <= discount.endTime
        );
      }
    }
    return true;
  });
}

export async function getScheduledDiscountsForProduct(productId: string) {
  const now = new Date();
  const product = await Product.findById(productId);

  if (!product) {
    return [];
  }

  return Discount.find({
    isActive: true,
    startDate: { $gt: now },
    $or: [
      { targetType: "all" },
      { targetType: "categories", categories: product.category },
      { targetType: "products", products: product._id },
    ],
  })
    .populate("categories", "name slug")
    .populate("products", "name slug")
    .sort({ startDate: 1, startTime: 1 });
}

export async function isDiscountActiveForProduct(
  discountId: string,
  productId: string
): Promise<boolean> {
  const now = new Date();
  const currentTime = getCurrentTime();

  const [discount, product] = await Promise.all([
    Discount.findById(discountId),
    Product.findById(productId),
  ]);

  if (!discount || !product) return false;

  if (!discount.isActive) return false;
  if (now < discount.startDate || now > discount.endDate) return false;

  if (discount.startTime && discount.endTime) {
    if (discount.startTime <= discount.endTime) {
      if (currentTime < discount.startTime || currentTime > discount.endTime) {
        return false;
      }
    } else {
      if (currentTime < discount.startTime && currentTime > discount.endTime) {
        return false;
      }
    }
  }

  switch (discount.targetType) {
    case "all":
      return true;
    case "categories":
      return (
        discount.categories?.some((c) => c.equals(product.category)) || false
      );
    case "products":
      return discount.products?.some((p) => p.equals(product._id)) || false;
    default:
      return false;
  }
}
