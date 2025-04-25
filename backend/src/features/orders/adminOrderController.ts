import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Order from "./OrderModel.js";
import Product from "../products/ProductModel.js";
import Warehouse from "../warehouses/WarehouseModel.js";

// Fetch a specific order by ID
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Edit an order and update warehouse stock accordingly
export const editOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;
  const updateData = req.body;
  const { currency, products: updatedProducts } = updateData;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch the existing order
    const existingOrder = await Order.findById(orderId).session(session);
    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Fetch the corresponding warehouse
    const warehouse = await Warehouse.findById(existingOrder.warehouse).session(
      session
    );
    if (!warehouse) {
      throw new Error("Warehouse not found for this order");
    }

    // Update warehouse stock based on product changes
    await updateWarehouseStock(
      existingOrder,
      updatedProducts,
      warehouse,
      session
    );

    // Recalculate the total price of the order
    updateData.totalPrice = await recalculateTotalPrice(
      updatedProducts,
      currency
    );

    // Update the order in the database
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      session,
    });

    if (!updatedOrder) {
      throw new Error("Failed to update the order");
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// Fetch all orders
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await Order.find();

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Filter orders based on query parameters
export const filterOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status, checked, sortOrder } = req.query;

  try {
    let query = {};

    if (status) {
      query = { ...query, status };
    }

    if (checked !== undefined) {
      query = { ...query, checked: checked === "true" };
    }

    let orders = await Order.find(query);

    if (sortOrder === "newest") {
      orders = orders.sort(
        (a, b) =>
          new Date(b.dateOfCreation).getTime() -
          new Date(a.dateOfCreation).getTime()
      );
    } else if (sortOrder === "oldest") {
      orders = orders.sort(
        (a, b) =>
          new Date(a.dateOfCreation).getTime() -
          new Date(b.dateOfCreation).getTime()
      );
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function: Update warehouse stock
const updateWarehouseStock = async (
  existingOrder: any,
  updatedProducts: any[],
  warehouse: any,
  session: any
) => {
  const existingProductMap = new Map();
  existingOrder.products.forEach((product: any) => {
    existingProductMap.set(product.productId.toString(), product.amount);
  });

  const updatedProductMap = new Map();
  updatedProducts.forEach((product: any) => {
    updatedProductMap.set(product.productId.toString(), product.amount);
  });

  // Handle removed products
  for (const [productId, amount] of existingProductMap.entries()) {
    if (!updatedProductMap.has(productId)) {
      const warehouseProduct = warehouse.products.find(
        (p: any) => p.product.toString() === productId
      );
      if (warehouseProduct) {
        warehouseProduct.amount += amount;
      }
    }
  }

  // Handle added or updated products
  for (const [productId, newAmount] of updatedProductMap.entries()) {
    const oldAmount = existingProductMap.get(productId) || 0;
    const difference = newAmount - oldAmount;

    const warehouseProduct = warehouse.products.find(
      (p: any) => p.product.toString() === productId
    );

    if (!warehouseProduct) {
      throw new Error(`Product with ID "${productId}" not found in warehouse`);
    }

    warehouseProduct.amount -= difference;
  }

  // Save the updated warehouse stock
  await warehouse.save({ session });
};

// Helper function: Recalculate total price
const recalculateTotalPrice = async (
  updatedProducts: any[],
  currency: string
) => {
  const productIds = updatedProducts.map((product: any) => product.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  const productPriceMap = new Map();
  products.forEach((product: any) => {
    const price =
      currency === "rubles"
        ? product.price.rubles.amount
        : product.price.euros.amount;
    productPriceMap.set(product._id.toString(), price);
  });

  return updatedProducts.reduce((total: number, product: any) => {
    const productPrice = productPriceMap.get(product.productId);
    return total + product.amount * productPrice;
  }, 0);
};
