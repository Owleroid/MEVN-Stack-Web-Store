import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

import Order, { OrderDocument, OrderProduct } from "./OrderModel.js";

import { recalculateTotalPrice } from "./adminOrderService.js";
import * as warehouseService from "../warehouses/warehouseService.js";

import ApiError, { ErrorType } from "../../utils/apiError.js";
import { asyncHandler, transactionHandler } from "../../utils/asyncHandlers.js";

interface OrderUpdateData {
  currency: "rubles" | "euros";
  products: OrderProduct[];
  status: OrderDocument["status"];
  checked?: boolean;
  totalPrice?: number;
  shippingAddress?: OrderDocument["shippingAddress"];
  recipient?: OrderDocument["recipient"];
  paymentMethod?: string;
  orderNotes?: string;
  trackingNumber?: string;
  warehouse?: mongoose.Types.ObjectId;
}

interface FilterQuery {
  status?: OrderDocument["status"];
  checked?: boolean;
}

export const getOrderById = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("warehouse", "name");

    if (!order) {
      throw new ApiError(404, "Order not found", ErrorType.RESOURCE_NOT_FOUND);
    }

    res.status(200).json({
      success: true,
      order,
    });
  }
);

export const editOrderById = transactionHandler(
  async (
    req: Request,
    res: Response,
    _next: NextFunction,
    session: mongoose.ClientSession
  ) => {
    const { orderId } = req.params;
    const updateData: OrderUpdateData = req.body;
    const {
      currency,
      products: updatedProducts,
      status: newStatus,
      warehouse: newWarehouseId,
    } = updateData;

    const existingOrder = await Order.findById(orderId).session(session);
    if (!existingOrder) {
      throw new ApiError(404, "Order not found", ErrorType.RESOURCE_NOT_FOUND);
    }

    const oldStatus = existingOrder.status;
    const oldWarehouseId = existingOrder.warehouse;

    if (
      existingOrder.status === "waiting confirmation" &&
      newStatus !== "waiting confirmation"
    ) {
      updateData.checked = true;
    }

    try {
      await handleWarehouseUpdates(
        oldWarehouseId,
        newWarehouseId,
        oldStatus,
        newStatus,
        existingOrder,
        updatedProducts,
        session
      );

      updateData.totalPrice = await recalculateTotalPrice(
        updatedProducts,
        currency
      );

      const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
        session,
      });

      if (!updatedOrder) {
        throw new ApiError(
          500,
          "Failed to update the order",
          ErrorType.INTERNAL
        );
      }

      res.status(200).json({
        success: true,
        message: "Order updated successfully",
        order: updatedOrder,
      });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        400,
        error instanceof Error ? error.message : String(error),
        ErrorType.BAD_REQUEST
      );
    }
  }
);

/**
 * Handles warehouse stock updates based on order changes
 *
 * @param oldWarehouseId Previous warehouse ID
 * @param newWarehouseId New warehouse ID
 * @param oldStatus Previous order status
 * @param newStatus New order status
 * @param existingOrder The existing order document
 * @param updatedProducts Updated product list
 * @param session Mongoose session for transaction
 */
async function handleWarehouseUpdates(
  oldWarehouseId: mongoose.Types.ObjectId | undefined,
  newWarehouseId: mongoose.Types.ObjectId | undefined,
  oldStatus: OrderDocument["status"],
  newStatus: OrderDocument["status"],
  existingOrder: OrderDocument,
  updatedProducts: OrderProduct[],
  session: mongoose.ClientSession
): Promise<void> {
  if (
    newWarehouseId &&
    (!oldWarehouseId || newWarehouseId.toString() !== oldWarehouseId.toString())
  ) {
    await handleWarehouseTransfer(
      oldWarehouseId,
      newWarehouseId,
      oldStatus,
      newStatus,
      existingOrder.products,
      updatedProducts,
      session
    );
  } else if (oldWarehouseId) {
    await handleSameWarehouseUpdates(
      oldWarehouseId,
      oldStatus,
      newStatus,
      existingOrder.products,
      updatedProducts,
      session
    );
  }
}

/**
 * Handles transferring an order from one warehouse to another
 */
async function handleWarehouseTransfer(
  oldWarehouseId: mongoose.Types.ObjectId | undefined,
  newWarehouseId: mongoose.Types.ObjectId,
  oldStatus: OrderDocument["status"],
  newStatus: OrderDocument["status"],
  oldProducts: OrderProduct[],
  newProducts: OrderProduct[],
  session: mongoose.ClientSession
): Promise<void> {
  if (oldWarehouseId && oldStatus !== "canceled") {
    const oldWarehouse = await warehouseService.getWarehouseById(
      oldWarehouseId,
      session
    );

    if (!oldWarehouse) {
      throw new ApiError(
        404,
        "Old warehouse not found",
        ErrorType.RESOURCE_NOT_FOUND
      );
    }

    await warehouseService.returnProductsToWarehouse(
      oldWarehouse,
      oldProducts,
      session
    );
  }

  if (newStatus !== "canceled") {
    const newWarehouse = await warehouseService.getWarehouseById(
      newWarehouseId,
      session
    );

    if (!newWarehouse) {
      throw new ApiError(
        404,
        "New warehouse not found",
        ErrorType.RESOURCE_NOT_FOUND
      );
    }

    await warehouseService.removeProductsFromWarehouse(
      newWarehouse,
      newProducts,
      session
    );
  }
}

/**
 * Handles stock updates when the warehouse remains the same
 */
async function handleSameWarehouseUpdates(
  warehouseId: mongoose.Types.ObjectId,
  oldStatus: OrderDocument["status"],
  newStatus: OrderDocument["status"],
  oldProducts: OrderProduct[],
  newProducts: OrderProduct[],
  session: mongoose.ClientSession
): Promise<void> {
  const warehouse = await warehouseService.getWarehouseById(
    warehouseId,
    session
  );

  if (!warehouse) {
    throw new ApiError(
      404,
      "Warehouse not found for this order",
      ErrorType.RESOURCE_NOT_FOUND
    );
  }

  if (oldStatus !== "canceled" && newStatus === "canceled") {
    await warehouseService.returnProductsToWarehouse(
      warehouse,
      oldProducts,
      session
    );
  } else if (oldStatus === "canceled" && newStatus !== "canceled") {
    await warehouseService.removeProductsFromWarehouse(
      warehouse,
      newProducts,
      session
    );
  } else if (oldStatus !== "canceled" && newStatus !== "canceled") {
    await warehouseService.updateWarehouseStock(
      oldProducts,
      newProducts,
      warehouse,
      session
    );
  }
}

export const getAllOrders = asyncHandler(
  async (_req: Request, res: Response) => {
    const orders = await Order.find().populate("warehouse", "name");

    res.status(200).json({
      success: true,
      orders,
    });
  }
);

export const filterOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const { status, checked, sortOrder } = req.query;

    let query: FilterQuery = {};

    if (status) {
      query.status = status as OrderDocument["status"];
    }

    if (checked !== undefined) {
      query.checked = checked === "true";
    }

    let orders = await Order.find(query).populate("warehouse", "name");

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
  }
);
