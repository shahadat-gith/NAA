import Notice from "../models/Academic/notices.js";
import { uploadPdfToCloudinary, uploadToCloudinary, deleteFromCloudinary } from "../config/cloudinary.js";

// Create a new notice
export const createNotice = async (req, res) => {
   try {
      const { title, noticeType, externalUrl, linkedPage } = req.body;

      let noticeData = {
         title,
         noticeType
      };

      // 1. Handle File Upload (PDF or Images)
      if (noticeType === 'FILE' && req.file) {
         let uploadResult;
         // If it's a PDF, use the raw resource type uploader
         if (req.file.mimetype === 'application/pdf') {
            uploadResult = await uploadPdfToCloudinary(req.file.buffer, "naa_notices/pdfs");
         } else {
            // Otherwise treat as image
            uploadResult = await uploadToCloudinary(req.file.buffer, "naa_notices/images");
         }

         noticeData.file = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
         };
      }

      // 2. Handle External Links
      if (noticeType === 'EXTERNAL_LINK') {
         noticeData.externalUrl = externalUrl;
      }

      // 3. Handle Internal Page Links
      if (noticeType === 'INTERNAL_LINK') {
         noticeData.linkedPage = linkedPage;
      }

      // Save to MongoDB
      const newNotice = new Notice(noticeData);
      await newNotice.save();

      res.status(201).json({
         success: true,
         message: "Notice published successfully!",
         notice: newNotice
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
      res.status(200).json({
         success: true,
         message: "Notice deleted successfully."
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