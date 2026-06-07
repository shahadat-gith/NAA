import Achievers from "../models/Academic/achievers.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

const uploadToCloudinary = async (file, folder = "achievers") => {
  if (!file) return null;

  if (file.path) {
    return await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: "image",
    });
  }

  if (file.buffer) {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });
  }

  throw new Error("Invalid image file");
};

const getPublicIdFromCloudinaryUrl = (url) => {
  if (!url) return null;

  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  const publicPath = parts[1]
    .replace(/^v\d+\//, "")
    .replace(/\.[^/.]+$/, "");

  return publicPath;
};

export const addAchieversDetails = async (req, res) => {
  try {
    const {
      name,
      father,
      mother,
      village,
      percentage,
      className,
      year,
    } = req.body;

    const imgFile = req.file;

    if (!name || !percentage || !className || !year) {
      return res.status(400).json({
        success: false,
        message: "Name, percentage, class, and year are required",
      });
    }

    const percentageRegex = /^\d+(\.\d{1,2})?$/;
    if (!percentageRegex.test(percentage) || Number(percentage) > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage must be a valid number and should not exceed 100",
      });
    }

    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(year)) {
      return res.status(400).json({
        success: false,
        message: "Year must be a valid four-digit number",
      });
    }

    let imageUrl = "";

    if (imgFile) {
      const uploadResult = await uploadToCloudinary(imgFile, "achievers");
      imageUrl = uploadResult.secure_url;
    }

    const newAchiever = await Achievers.create({
      name: name.trim(),
      father: father?.trim() || "",
      mother: mother?.trim() || "",
      village: village?.trim() || "",
      percentage,
      year,
      className,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Achiever added successfully",
      data: newAchiever,
    });
  } catch (error) {
    console.error("Add achiever error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to add achiever",
    });
  }
};

export const updateAchiever = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      father,
      mother,
      village,
      percentage,
      className,
      year,
    } = req.body;

    const imgFile = req.file;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid achiever ID",
      });
    }

    const achiever = await Achievers.findById(id);

    if (!achiever) {
      return res.status(404).json({
        success: false,
        message: "Achiever not found",
      });
    }

    if (!name || !percentage || !className || !year) {
      return res.status(400).json({
        success: false,
        message: "Name, percentage, class, and year are required",
      });
    }

    const percentageRegex = /^\d+(\.\d{1,2})?$/;
    if (!percentageRegex.test(percentage) || Number(percentage) > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage must be a valid number and should not exceed 100",
      });
    }

    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(year)) {
      return res.status(400).json({
        success: false,
        message: "Year must be a valid four-digit number",
      });
    }

    let imageUrl = achiever.image;

    if (imgFile) {
      const oldPublicId = getPublicIdFromCloudinaryUrl(achiever.image);

      if (oldPublicId) {
        await cloudinary.uploader.destroy(oldPublicId);
      }

      const uploadResult = await uploadToCloudinary(imgFile, "achievers");
      imageUrl = uploadResult.secure_url;
    }

    achiever.name = name.trim();
    achiever.father = father?.trim() || "";
    achiever.mother = mother?.trim() || "";
    achiever.village = village?.trim() || "";
    achiever.percentage = percentage;
    achiever.className = className;
    achiever.year = year;
    achiever.image = imageUrl;

    await achiever.save();

    res.status(200).json({
      success: true,
      message: "Achiever updated successfully",
      data: achiever,
    });
  } catch (error) {
    console.error("Update achiever error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update achiever",
    });
  }
};
export const deleteAchiever = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid achiever ID",
      });
    }

    // Find achiever by _id
    const achiever = await Achievers.findById(id);

    if (!achiever) {
      return res.status(404).json({
        success: false,
        message: "Achiever not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (achiever.image) {
      const publicId = achiever.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`achievers/${publicId}`);
    }

    // Delete achiever from database
    await Achievers.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Achiever deleted successfully",
    });
  } catch (error) {
    console.error("Delete achiever error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete achiever",
      error: error.message,
    });
  }
};


export const getAchievers = async (req, res) => {
  try {
    // Fetch all achievers, sorted by percentage (descending)
    const achievers = await Achievers.find()
      .sort({ percentage: -1 })
      .lean();

    res.status(200).json({
      success: true,
      message: "Achievers fetched successfully",
      achievers,
    });
  } catch (error) {
    console.error("Fetch achievers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch achievers",
      error: error.message,
    });
  }
};