import imagekit from "../config/imagekit.js";

// UPLOAD IMAGE
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!imagekit || typeof imagekit.upload !== "function") {
      return res.status(500).json({
        success: false,
        message:
          "ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT in backend/.env",
      });
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Upload failed",
    });
  }
};
