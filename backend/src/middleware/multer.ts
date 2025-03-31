import multer from "multer";

// Configure Multer to store files in memory
const storage = multer.memoryStorage();

// Create the Multer instance with the storage configuration
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
  fileFilter: (_req, file, cb) => {
    // Define allowed MIME types for popular image formats
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
  },
});
