import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("File path is missing for Cloudinary upload");
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "products",
      resource_type: "image",
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error?.message || error);

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw error;
  }
};

export default uploadOnCloudinary;
