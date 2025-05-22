import { Request, Response, NextFunction } from "express";

import * as warehouseService from "./warehouseService.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";

export const getAllWarehouses = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const warehouses = await warehouseService.getAllWarehouses();
    res.status(200).json(warehouses);
  }
);

export const getWarehouseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const warehouse = await warehouseService.getWarehouseById(req.params.id);
    if (!warehouse) {
      return next(new ApiError(404, "Warehouse not found"));
    }
    res.status(200).json(warehouse);
  }
);

export const updateWarehouse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, amount } = req.body;
    const warehouseId = req.params.id;

    const updatedWarehouse =
      await warehouseService.updateProductAmountInWarehouse(
        warehouseId,
        productId,
        amount
      );

    if (!updatedWarehouse) {
      return next(new ApiError(404, "Warehouse or product not found"));
    }

    res.status(200).json(updatedWarehouse);
  }
);
