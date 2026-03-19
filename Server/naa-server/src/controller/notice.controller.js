import Notice from "../models/Academic/notices.js";
import { uploadPdfToCloudinary, uploadImageToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// Create a new notice
export const createNotice = async (req, res) => {
   try {
      const {
         title,
         description,
         noticeType,
         externalUrl,
         linkedPage,
         targetDate
      } = req.body;

      // 🔹 Basic validation
      if (!title) {
         return res.status(400).json({
            success: false,
            message: "Title is required"
         });
      }

      let noticeData = {
         title,
         description: description || "",
         noticeType,
         targetDate: targetDate || null
      };

      // 1️⃣ Handle File Upload (PDF or Image)
      if (noticeType === "FILE") {
         if (!req.file) {
            return res.status(400).json({
               success: false,
               message: "File is required for FILE type notice"
            });
         }

         let uploadResult;

         if (req.file.mimetype === "application/pdf") {
            uploadResult = await uploadPdfToCloudinary(
               req.file,
               "naa_notices/pdfs"
            );
         } else {
            uploadResult = await uploadImageToCloudinary(
               req.file,
               "naa_notices/images"
            );
         }

         noticeData.file = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
         };
      }

      // 2️⃣ Handle External Link
      if (noticeType === "EXTERNAL_LINK") {
         if (!externalUrl) {
            return res.status(400).json({
               success: false,
               message: "External URL is required"
            });
         }
         noticeData.externalUrl = externalUrl;
      }

      // 3️⃣ Handle Internal Link
      if (noticeType === "INTERNAL_LINK") {
         if (!linkedPage) {
            return res.status(400).json({
               success: false,
               message: "Linked page is required"
            });
         }
         noticeData.linkedPage = linkedPage;
      }

      // ✅ Save Notice
      const newNotice = new Notice(noticeData);
      await newNotice.save();

      const notices = await Notice.find().sort({ createdAt: -1 });

      res.status(201).json({
         success: true,
         message: "Notice published successfully!",
         notices
      });

   } catch (error) {
      console.error("Notice Creation Error:", error);

      res.status(500).json({
         success: false,
         message: "Failed to create notice. Please try again.",
         error: error.message
      });
   }
};


// Get all notices
export const getNotices = async (req, res) => {
   try {
      const notices = await Notice.find().sort({ createdAt: -1 });
      res.status(200).json({
         success: true,
         notices
      });
   } catch (error) {
      console.error("Get Notices Error:", error);
      res.status(500).json({
         success: false,
         message: "Failed to retrieve notices. Please try again.",
         error: error.message
      });
   }
};

// Get a single notice by ID
export const getNoticeById = async (req, res) => {
   try {
      const noticeId = req.params.id;
      const notice = await Notice.findById(noticeId);
      if (!notice) {
         return res.status(404).json({
            success: false,
            message: "Notice not found."
         });
      }
      res.status(200).json({
         success: true,
         notice
      });
   } catch (error) {
      console.error("Get Notice By ID Error:", error);
      res.status(500).json({
         success: false,
         message: "Failed to retrieve notice. Please try again.",
         error: error.message
      });
   }
};


// Delete a notice by ID
export const deleteNotice = async (req, res) => {
   try {
      const noticeId = req.params.id;
      const notice = await Notice.findById(noticeId);
      if (!notice) {
         return res.status(404).json({
            success: false,
            message: "Notice not found."
         });
      }
      // If the notice has an associated file, delete it from Cloudinary
      if (notice.file && notice.file.public_id) {
         await deleteFromCloudinary(notice.file.public_id);
      }

      await Notice.findByIdAndDelete(noticeId);
      const notices = await Notice.find().sort({ createdAt: -1 });
      res.status(200).json({
         success: true,
         message: "Notice deleted successfully.",
         notices
      });
   } catch (error) {
      console.error("Delete Notice Error:", error);
      res.status(500).json({
         success: false,
         message: "Failed to delete notice. Please try again.",
         error: error.message
      });
   }
};

export const updateNotice = async (req, res) => {
   try {
      const noticeId = req.params.id;
      const { title, description, noticeType, externalUrl, linkedPage, targetDate } = req.body;
      const notice = await Notice.findById(noticeId);
      if (!notice) {
         return res.status(404).json({
            success: false,
            message: "Notice not found."
         });
      }
      notice.title = title || notice.title;
      notice.description = description || notice.description;
      notice.noticeType = noticeType || notice.noticeType;
      notice.externalUrl = externalUrl || notice.externalUrl;
      notice.linkedPage = linkedPage || notice.linkedPage;
      notice.targetDate = targetDate || notice.targetDate;

      // Handle file update if a new file is uploaded
      if (req.file) {
         // Delete old file from Cloudinary if it exists
         if (notice.file && notice.file.public_id) {
            await deleteFromCloudinary(notice.file.public_id);
         }
      }
      let uploadResult;
      if (req.file.mimetype === "application/pdf") {
         uploadResult = await uploadPdfToCloudinary(
            req.file,
            "naa_notices/pdfs"
         );
      } else {
         uploadResult = await uploadImageToCloudinary(
            req.file,
            "naa_notices/images"
         );
      }
      notice.file = {
         url: uploadResult.secure_url,
         public_id: uploadResult.public_id
      };

      await notice.save();

      const notices = await Notice.find().sort({ createdAt: -1 });
      res.status(200).json({
         success: true,
         message: "Notice updated successfully.",
         notices
      });
   } catch (error) {
      console.error("Update Notice Error:", error);
      res.status(500).json({
         success: false,
         message: "Failed to update notice. Please try again.",
         error: error.message
      });
   }
};