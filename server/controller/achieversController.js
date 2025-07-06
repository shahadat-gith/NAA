import Achievers from "../models/achievers.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

export const addAchieversDetails = async (req, res) => {
  try {
    const { name, father, mother, village, percentage, className, year } = req.body;
    const imgFile = req.file;

    // Validate required fields
    if (!name || !percentage || !className || !year) {
      return res.status(400).json({
        success: false,
        message: "Name, percentage, class, and year are required",
      });
    }

    // Validate percentage format (e.g., "85", "85.5")
    const percentageRegex = /^\d+(\.\d{1,2})?$/;
    if (!percentageRegex.test(percentage) || parseFloat(percentage) > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage must be a valid number (e.g., 85 or 85.5) and not exceed 100",
      });
    }

    // Validate year format (e.g., "2023")
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(year)) {
      return res.status(400).json({
        success: false,
        message: "Year must be a valid four-digit number (e.g., 2023)",
      });
    }

    let imageUrl = "";
    if (imgFile) {
      // Upload image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(imgFile.path, {
        folder: "achievers",
        resource_type: "image",
      });

      imageUrl = uploadResult.secure_url;
    }

    // Create new achiever
    const newAchiever = new Achievers({
      name,
      father: father || "",
      mother: mother || "",
      village: village || "",
      percentage,
      year,
      className,
      image: imageUrl,
    });

    // Save to database
    await newAchiever.save();

    res.status(201).json({
      success: true,
      message: "Achiever added successfully",
      data: newAchiever,
    });
  } catch (error) {
    console.error("Add achiever error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add achiever",
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

export const updateAchiever = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, father, mother, village, percentage, className, year } = req.body;
    const imgFile = req.file;

    // Validate achiever ID
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

    // Validate required fields
    if (!name || !percentage || !className || !year) {
      return res.status(400).json({
        success: false,
        message: "Name, percentage, class, and year are required",
      });
    }



    // Handle image update
    let imageUrl = achiever.image;
    if (imgFile) {
      // Delete existing image from Cloudinary if it exists
      if (achiever.image) {
        const publicId = achiever.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`achievers/${publicId}`);
      }

      // Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(imgFile.path, {
        folder: "achievers",
        resource_type: "image",
      });
      imageUrl = uploadResult.secure_url;
    }

    // Update achiever fields
    achiever.name = name;
    achiever.father = father || "";
    achiever.mother = mother || "";
    achiever.village = village || "";
    achiever.percentage = percentage;
    achiever.className = className;
    achiever.year = year;
    achiever.image = imageUrl;

    // Save updated achiever
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
      message: "Failed to update achiever",
      error: error.message,
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