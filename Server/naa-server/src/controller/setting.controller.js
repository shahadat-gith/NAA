import ServiceSettings from "../models/Settings/services.js";
import FeesSettings from "../models/Settings/fees.js";
import AdmitCard from "../models/Settings/admitcard.js";
import Exam from "../models/Settings/exam.js";
import HeroImage from "../models/Settings/heroImages.js";
import cloudinary from "../config/cloudinary.js";



export const getSettings = async (req, res) => {
  try {
    const { type } = req.params;

    let data = null;

    if (type === "services") {
      data = await ServiceSettings.findOne({});
    } else if (type === "fees") {
      data = await FeesSettings.findOne({});
    } else if (type === "admitcard") {
      const admitCards = await AdmitCard.find({});
      const examSettings = await Exam.find({});
      data = { admitCards, examSettings };
    } else {
      return res.status(400).json({ success: false, message: "Invalid settings type" });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const toggleServiceSetting = async (req, res) => {
  try {
    const { setting } = req.params;
    const allowedSettings = [
      "feeMonthly",
      "feeAdmission",
      "feeHostel",
      "result",
      "admitCard",
      "admission",
    ];

    if (!allowedSettings.includes(setting)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service setting",
      });
    }
    let serviceSettings = await ServiceSettings.findOne();
    if (!serviceSettings) {
      serviceSettings = await ServiceSettings.create({});
    }

    serviceSettings[setting] = !serviceSettings[setting];
    await serviceSettings.save();

    return res.status(200).json({
      success: true,
      message: "Service setting updated",
      data: serviceSettings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


export const updateAdmitCard = async (req, res) => {
  try {
    const { class: classNum, stream,medium, examCenter, exams } = req.body;
    let admitCard = await AdmitCard.findOne({ class: classNum, medium, stream: stream || "" });
    if (!admitCard) {
      admitCard = new AdmitCard({ class: classNum, medium, stream: stream || "" });
    } 
    admitCard.medium = medium || "";
    admitCard.examCenter = examCenter || "";
    admitCard.exams = exams || [];
    await admitCard.save();
    res.status(200).json({ success:true, message: "Admit card updated", data: admitCard });
  } catch (error) {
    res.status(500).json({ success:false, message: "Server Error", error: error.message });
  }
};


export const deleteAdmitCard = async (req, res) => {
  try {
    const { id } = req.params;
    const admitCard = await AdmitCard.findById(id);
    if (!admitCard) {
      return res.status(404).json({ success:false, message: "Admit card not found" });
    }
    await AdmitCard.findByIdAndDelete(id);
    res.status(200).json({ success:true, message: "Admit card deleted" });
  } catch (error) {
    res.status(500).json({ success:false, message: "Server Error", error: error.message });
  }
};



export const getHeroImages = async (req, res) => {
  try {
    const images = await HeroImage.find().sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch hero images",
      error: error.message,
    });
  }
};


export const updateHeroImage = async (req, res) => {
  try {
    const { heroImageId } = req.body;

    /* ================= VALIDATION ================= */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    /* ================= UPLOAD NEW IMAGE ================= */
    const uploadResult = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      { folder: "system/hero" }
    );

    /* ================= ADD NEW HERO IMAGE ================= */
    if (!heroImageId) {
      const newHeroImage = await HeroImage.create({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });

      return res.status(201).json({
        success: true,
        message: "Hero image added successfully",
        data: newHeroImage,
      });
    }

    /* ================= UPDATE EXISTING HERO IMAGE ================= */
    const heroImage = await HeroImage.findById(heroImageId);

    if (!heroImage) {
      return res.status(404).json({
        success: false,
        message: "Hero image not found",
      });
    }

    // delete old image
    if (heroImage.publicId) {
      await cloudinary.uploader.destroy(heroImage.publicId);
    }

    heroImage.url = uploadResult.secure_url;
    heroImage.publicId = uploadResult.public_id;

    await heroImage.save();

    return res.status(200).json({
      success: true,
      message: "Hero image updated successfully",
      data: heroImage,
    });
  } catch (error) {
    console.error("Hero image upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Hero image operation failed",
      error: error.message,
    });
  }
};


export const upsertExam = async (req, res) => {
  try {
    const { examName, academicSession } = req.body;
    let exam = await Exam.findOne({ examName, academicSession });
    if (!exam) {
      exam = new Exam({ examName, academicSession });
    } else {
      exam.examName = examName;
      exam.academicSession = academicSession;
    }
    await exam.save();
    res.status(200).json({ success:true, message: "Exam upserted successfully", data: exam });
  } catch (error) {
    res.status(500).json({ success:false, message: "Server Error", error: error.message });
  }
};


