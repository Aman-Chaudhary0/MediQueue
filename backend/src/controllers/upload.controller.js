import imagekit from "../config/imagekit.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { InternalServerError, ValidationError } from "../utils/errors.js";

// UPLOAD IMAGE
export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ValidationError("No file uploaded");
    }

    if (!imagekit || typeof imagekit.upload !== "function") {
      throw new InternalServerError(
        "ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT in backend/.env"
      );
    }

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/mediqueue",
    });

    return res.status(200).json({
      success: true,
      imageUrl: response.url,
    });
});
