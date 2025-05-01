import { Request, Response, NextFunction } from "express";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

import Warehouse from "./WarehouseModel.js";

export const getAllWarehouses = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const warehouses = await Warehouse.find();
    res.status(200).json(warehouses);
  }
);

export const getWarehouseById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return next(new ApiError(404, "Warehouse not found"));
    }
    res.status(200).json(warehouse);
  }
);

export const updateWarehouse = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, amount } = req.body;

    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return next(new ApiError(404, "Warehouse not found"));
    }

    // Find the product in the warehouse and update its amount
    const productIndex = warehouse.products.findIndex(
      (p) => p.product.toString() === productId
    );
    if (productIndex !== -1) {
      warehouse.products[productIndex].amount = amount;
    } else {
      return next(
        new ApiError(404, `Product with ID ${productId} not found in warehouse`)
      );
    }

    const updatedWarehouse = await warehouse.save();
    res.status(200).json(updatedWarehouse);
  }
);
