import ServiceSettings from "../models/Settings/services.js";
import Fee from "../models/Settings/fees.js";
import AdmitCard from "../models/Settings/admitcard.js";
import Exam from "../models/Settings/exam.js";
import HeroImage from "../models/Settings/heroImages.js";
import { authorityModel } from "../models/Academic/authorities.js";
import cloudinary from "../config/cloudinary.js";



export const getSettings = async (req, res) => {
  try {
    const [serviceSettings, feesSettings, admitCards, exams, heroImages, authorities] = await Promise.all([
      ServiceSettings.findOne(),
      Fee.findOne(),
      AdmitCard.find(),
      Exam.find(),
      HeroImage.find().sort({ createdAt: 1 }),
      authorityModel.find(),
    ]); 
    res.status(200).json({ success: true, data: { serviceSettings, feesSettings, admitCards, exams, heroImages, authorities } });

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
    const { examName, academicSession, morning, afternoon } = req.body;

    const exam = await Exam.findOneAndUpdate(
      {}, // always target the single document
      {
        examName,
        academicSession,
        time: {
          morning,
          afternoon
        }
      },
      {
        new: true,
        upsert: true // creates only if collection is empty
      }
    );

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

export const updateAuthority = async (req, res) => {
  try {
    const { id, name, role } = req.body;

    let authority;

    /* ================= FIND OR CREATE ================= */
    if (id) {
      authority = await authorityModel.findById(id);
      if (!authority) {
        return res.status(404).json({
          success: false,
          message: "Authority not found",
        });
      }
    } else {
      authority = new authorityModel({});
    }

    /* ================= IMAGE UPLOAD ================= */
    if (req.files?.image) {
      const imageFile = req.files.image[0];

      const imageUpload = await cloudinary.uploader.upload(
        `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`,
        { folder: "authorities/images" }
      );

      // delete old image only if exists
      if (authority.image?.public_id) {
        await cloudinary.uploader.destroy(authority.image.public_id);
      }

      authority.image = {
        url: imageUpload.secure_url,
        public_id: imageUpload.public_id,
      };
    }

    /* ================= SIGNATURE UPLOAD ================= */
    if (req.files?.signature) {
      const signFile = req.files.signature[0];

      const signUpload = await cloudinary.uploader.upload(
        `data:${signFile.mimetype};base64,${signFile.buffer.toString("base64")}`,
        { folder: "authorities/signatures" }
      );

      // delete old signature only if exists
      if (authority.signature?.public_id) {
        await cloudinary.uploader.destroy(authority.signature.public_id);
      }

      authority.signature = {
        url: signUpload.secure_url,
        public_id: signUpload.public_id,
      };
    }

    /* ================= TEXT FIELDS ================= */
    if (name) authority.name = name;
    if (role) authority.role = role;

    /* ================= VALIDATION (ONLY FOR CREATE) ================= */
    if (!id) {
      if (!authority.name || !authority.role) {
        return res.status(400).json({
          success: false,
          message: "Name and role are required",
        });
      }

      if (!authority.image || !authority.signature) {
        return res.status(400).json({
          success: false,
          message: "Image and signature are required",
        });
      }
    }

    await authority.save();

    res.status(id ? 200 : 201).json({
      success: true,
      message: id
        ? "Authority updated successfully"
        : "Authority created successfully",
      data: authority,
    });
  } catch (error) {
    console.error("Authority upsert error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving authority",
      error: error.message,
    });
  }
};



