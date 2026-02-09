import express from "express";
import SystemImages from "../models/Settings/systemImages.js";
import cloudinary from "../config/cloudinary.js";
import { upload } from "../config/multer.js";

const imageRouter = express.Router();

imageRouter.get("/", async (req, res) => {
  try {
    const images = await SystemImages.findOne();

    if (!images) {
      return res.status(200).json({
        heroImages: [],
        principalImage: null,
        mdImage: null,
      });
    }

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch system images" });
  }
});

imageRouter.post("/update", upload.single("image"), async (req, res) => {
  try {
    const { type, heroImageId } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Image type is required" });
    }

    let systemImages = await SystemImages.findOne();
    if (!systemImages) systemImages = await SystemImages.create({});

    /* ================= HERO (UPDATE SINGLE IMAGE) ================= */
    if (type === "hero") {
      if (!heroImageId) {
        return res.status(400).json({
          message: "heroImageId is required to update hero image",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "New image file is required",
        });
      }

      const heroIndex = systemImages.heroImages.findIndex(
        (img) => img.publicId === heroImageId
      );

      if (heroIndex === -1) {
        return res.status(404).json({
          message: "Hero image not found",
        });
      }

      // destroy old image
      await cloudinary.uploader.destroy(heroImageId);

      // upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "system/hero",
      });

      systemImages.heroImages[heroIndex] = {
        url: result.secure_url,
        publicId: result.public_id,
      };

      await systemImages.save();

      return res.status(200).json({
        message: "Hero image updated successfully",
        heroImages: systemImages.heroImages,
      });
    }

    /* ================= PRINCIPAL / MD ================= */
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    const folderMap = {
      principal: "system/principal",
      md: "system/md",
    };

    if (!folderMap[type]) {
      return res.status(400).json({ message: "Invalid image type" });
    }

    const oldImage =
      type === "principal"
        ? systemImages.principalImage
        : systemImages.mdImage;

    if (oldImage?.publicId) {
      await cloudinary.uploader.destroy(oldImage.publicId);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderMap[type],
    });

    const imageData = {
      url: result.secure_url,
      publicId: result.public_id,
    };

    if (type === "principal") systemImages.principalImage = imageData;
    if (type === "md") systemImages.mdImage = imageData;

    await systemImages.save();

    res.status(200).json({
      message: `${type.toUpperCase()} image updated successfully`,
      image: imageData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image update failed" });
  }
});




export default imageRouter;
