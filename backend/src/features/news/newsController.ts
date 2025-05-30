import { Request, Response, NextFunction } from "express";

import News from "./NewsModel.js";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandlers.js";

/**
 * Get all active news without pagination (legacy endpoint)
 */
export const getActiveNews = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const language = (req.query.language as string) || "en";
    const news = await News.find({ isActive: true, language }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      news,
    });
  }
);

/**
 * Get paginated active news
 */
export const getPaginatedActiveNews = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Parse pagination parameters with defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const language = (req.query.language as string) || "en";

    // Ensure valid pagination parameters
    const validPage = page > 0 ? page : 1;
    const validLimit = limit > 0 && limit <= 50 ? limit : 10;

    // Calculate skip value for pagination
    const skip = (validPage - 1) * validLimit;

    // Get total count for pagination metadata
    const totalItems = await News.countDocuments({ isActive: true, language });

    // Fetch paginated news items
    const news = await News.find({ isActive: true, language })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / validLimit);

    res.status(200).json({
      success: true,
      news,
      pagination: {
        totalItems,
        itemsPerPage: validLimit,
        currentPage: validPage,
        totalPages,
      },
    });
  }
);

export const getAllNews = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const language = req.query.language as string;
    const query = language ? { language } : {};

    const news = await News.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      news,
    });
  }
);

export const getNewsById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const newsItem = await News.findById(id);

    if (!newsItem) {
      return next(new ApiError(404, "News item not found"));
    }

    res.status(200).json({
      success: true,
      news: newsItem,
    });
  }
);

export const createNews = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, text, imageUrl, language } = req.body;

    if (!title || !text) {
      return next(new ApiError(400, "Title and text are required"));
    }

    const newNews = new News({
      title,
      text,
      imageUrl,
      language: language || "en",
      isActive: true,
    });

    const savedNews = await newNews.save();

    res.status(201).json({
      success: true,
      news: savedNews,
    });
  }
);

export const updateNews = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, text, imageUrl, isActive, language } = req.body;

    const updates: Record<string, any> = {};

    if (title !== undefined) updates.title = title;
    if (text !== undefined) updates.text = text;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (isActive !== undefined) updates.isActive = isActive;
    if (language !== undefined) updates.language = language;

    const updatedNews = await News.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedNews) {
      return next(new ApiError(404, "News item not found"));
    }

    res.status(200).json({
      success: true,
      news: updatedNews,
    });
  }
);

export const updateNewsStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return next(new ApiError(400, "isActive status is required"));
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!updatedNews) {
      return next(new ApiError(404, "News item not found"));
    }

    res.status(200).json({
      success: true,
      news: updatedNews,
    });
  }
);

export const deleteNews = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return next(new ApiError(404, "News item not found"));
    }

    res.status(200).json({
      success: true,
    });
  }
);
