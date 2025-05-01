import { Storage } from "@google-cloud/storage";
import { Request, Response, NextFunction } from "express";

import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

interface ImageInfo {
  name: string;
  url: string;
}

interface DeleteImagesRequest extends Request {
  body: {
    imageNames: string[];
  };
}

const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE_PATH,
});
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME!;

export const fetchImages = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const [files] = await storage.bucket(bucketName).getFiles();
    const images: ImageInfo[] = files.map((file) => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucketName}/${file.name}`,
    }));

    res.status(200).json({
      success: true,
      message: "Images fetched successfully",
      images,
    });
  }
);

export const uploadImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !Array.isArray(req.files)) {
      return next(new ApiError(400, "No files uploaded"));
    }

    const files = req.files as Express.Multer.File[];
    const uploadedImages: ImageInfo[] = [];

    for (const file of files) {
      const blob = storage.bucket(bucketName).file(file.originalname);

      await new Promise<void>((resolve, reject) => {
        const stream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
        });

        stream.on("finish", () => {
          uploadedImages.push({
            name: file.originalname,
            url: `https://storage.googleapis.com/${bucketName}/${file.originalname}`,
          });
          resolve();
        });

        stream.on("error", (err: Error) => {
          console.error("Error uploading file:", err);
          reject(
            new ApiError(500, `Failed to upload image: ${file.originalname}`)
          );
        });

        stream.end(file.buffer);
      });
    }

    res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  }
);

export const deleteImages = asyncHandler(
  async (req: DeleteImagesRequest, res: Response, next: NextFunction) => {
    const { imageNames } = req.body;

    if (!imageNames || !Array.isArray(imageNames) || imageNames.length === 0) {
      return next(
        new ApiError(400, "Image names are required and must be an array")
      );
    }

    const deletedImages: string[] = [];

    for (const imageName of imageNames) {
      await storage.bucket(bucketName).file(imageName).delete();
      deletedImages.push(imageName);
    }

    res.status(200).json({
      success: true,
      message: "Images deleted successfully",
      deletedImages,
    });
  }
);
