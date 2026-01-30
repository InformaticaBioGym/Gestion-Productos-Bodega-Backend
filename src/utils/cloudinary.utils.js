import { v2 as cloudinary } from "cloudinary";
import fs from "fs-extra";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const subirImagen = async (filePath) => {
  try {
    const resultado = await cloudinary.uploader.upload(filePath, {
      folder: "biogym-inventario",

      transformation: [
        { width: 800, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    await fs.remove(filePath);
    console.log(`Imagen subida y archivo temporal eliminado: ${filePath}`);

    return resultado.secure_url;
  } catch (error) {
    try {
      await fs.remove(filePath);
    } catch (unlinkError) {
      console.warn(
        `No se pudo eliminar archivo temporal: ${filePath}`,
        unlinkError.message,
      );
    }
    console.error("Error subiendo a Cloudinary:", error);
    throw new Error("Error al subir la imagen");
  }
};

export const eliminarImagen = async (urlCloudinary) => {
  try {
    if (!urlCloudinary) return;
    const publicId = urlCloudinary
      .split("/upload/")[1]
      .split(".")[0]
      .replace(/v\d+\//g, "");

    await cloudinary.uploader.destroy(publicId);
    console.log(`Imagen eliminada de Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("Error eliminando de Cloudinary:", error);
    throw new Error("Error al eliminar la imagen");
  }
};
