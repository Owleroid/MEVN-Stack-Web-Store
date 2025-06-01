import mongoose from "mongoose";
import Announcement from "./AnnouncementModel.js";

/**
 * Delete all announcements related to a specific product
 * @param productId The ID of the product to delete announcements for
 * @param session Optional mongoose session for transactions
 * @returns The deletion result with count of deleted announcements
 */
export const deleteAnnouncementsByProductId = async (
  productId: string,
  session?: mongoose.ClientSession
): Promise<{ deletedCount: number }> => {
  const options = session ? { session } : {};
  return Announcement.deleteMany({ product: productId }, options);
};
