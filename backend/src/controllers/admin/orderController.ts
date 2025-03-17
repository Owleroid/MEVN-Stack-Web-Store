import { Request, Response, NextFunction } from "express";

import Order from "../../models/Order.js";

// Get order by ID
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

// Delete order by ID
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

// Edit order by ID
export const editOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orderId } = req.params;
  const updateData = req.body;

  try {
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

// Get all orders
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

// Filter orders by specific filters
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
