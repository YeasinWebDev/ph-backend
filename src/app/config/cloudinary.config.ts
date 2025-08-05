import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";
import stream from "stream";
import { UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});
export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`;
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id,
          folder: "pdf",
          timeout: 120000,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }
          console.log("Cloudinary upload success:", result?.secure_url);
          resolve(result);
        }
      );

      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    console.log(error);
    throw new AppError(`Error uploading file ${error}`, 401);
  }
} ;

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary`);
    }
  } catch (error) {
    console.log(error);
    throw new AppError("Error deleting image from Cloudinary", 500);
  }
};

export const CloudinaryUpload = cloudinary;
