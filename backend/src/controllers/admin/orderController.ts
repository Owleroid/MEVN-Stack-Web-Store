import { Request, Response, NextFunction } from "express";

import Order from "../../models/Order.js";
import Product from "../../models/Product.js";

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

export const deleteOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const editOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;
  const updateData = req.body;
  const { currency } = updateData;

  try {
    // Fetch product prices from the database
    const productIds = updateData.products.map(
      (product: any) => product.productId
    );
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a map of product prices based on the specified currency
    const productPriceMap = new Map();
    products.forEach((product: any) => {
      const price =
        currency === "rubles"
          ? product.price.rubles.amount
          : product.price.euros.amount;
      productPriceMap.set(product._id.toString(), price);
    });

    // Recalculate totalPrice based on products, their amounts, and prices from the database
    updateData.totalPrice = updateData.products.reduce(
      (total: number, product: any) => {
        const productPrice = productPriceMap.get(product.productId);
        return total + product.amount * productPrice;
      },
      0
    );

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });

    if (!order) {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

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
