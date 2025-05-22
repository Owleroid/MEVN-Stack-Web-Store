import { Request, Response, NextFunction } from "express";

import Announcement from "./AnnouncementModel.js";
import Product from "../products/ProductModel.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";

export const getActiveAnnouncements = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const announcements = await Announcement.find({ isActive: true })
      .populate({
        path: "product",
        select: "name slug imageUrls",
        populate: {
          path: "category",
          select: "slug",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      announcements,
    });
  }
);

export const getAllAnnouncements = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const announcements = await Announcement.find({})
      .populate({
        path: "product",
        select: "name slug imageUrls",
        populate: {
          path: "category",
          select: "slug",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      announcements,
    });
  }
);

export const getAnnouncementById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const announcement = await Announcement.findById(id).populate({
      path: "product",
      select: "name slug imageUrls",
      populate: {
        path: "category",
        select: "slug",
      },
    });

    if (!announcement) {
      return next(new ApiError(404, "Announcement not found"));
    }

    res.status(200).json({
      success: true,
      announcement,
    });
  }
);

export const createAnnouncement = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId, text, imageUrl } = req.body;

    if (!productId || !imageUrl) {
      return next(new ApiError(400, "Product ID and image URL are required"));
    }

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return next(new ApiError(404, "Product not found"));
    }

    const newAnnouncement = new Announcement({
      product: productId,
      text,
      imageUrl,
      isActive: true,
    });

    const savedAnnouncement = await newAnnouncement.save();
    const populatedAnnouncement = await Announcement.findById(
      savedAnnouncement._id
    ).populate({
      path: "product",
      select: "name slug imageUrls",
      populate: {
        path: "category",
        select: "slug",
      },
    });

    res.status(201).json({
      success: true,
      announcement: populatedAnnouncement,
    });
  }
);

export const updateAnnouncementStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return next(new ApiError(400, "isActive status is required"));
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    ).populate({
      path: "product",
      select: "name slug imageUrls",
      populate: {
        path: "category",
        select: "slug",
      },
    });

    if (!updatedAnnouncement) {
      return next(new ApiError(404, "Announcement not found"));
    }

    res.status(200).json({
      success: true,
      announcement: updatedAnnouncement,
    });
  }
);

export const updateAnnouncementImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return next(new ApiError(400, "Image URL is required"));
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { imageUrl },
      { new: true, runValidators: true }
    ).populate({
      path: "product",
      select: "name slug imageUrls",
      populate: {
        path: "category",
        select: "slug",
      },
    });

    if (!updatedAnnouncement) {
      return next(new ApiError(404, "Announcement not found"));
    }

    res.status(200).json({
      success: true,
      announcement: updatedAnnouncement,
    });
  }
);

export const deleteAnnouncement = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return next(new ApiError(404, "Announcement not found"));
    }

    res.status(200).json({
      success: true,
    });
  }
);
