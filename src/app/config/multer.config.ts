import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { CloudinaryUpload } from "./cloudinary.config";

const stroage = new CloudinaryStorage({
  cloudinary: CloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const fileName = file.originalname
        .toLocaleLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-")
        .replace(/[^a-z0-9\-\.]/g, ""); // non alpha numeric - !@#$

      const uniqueFIleName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName 

      return uniqueFIleName;
    },
  },
});

export const malterUpload = multer({ storage: stroage });
