import { authorityModel } from "../models/Academic/authorities.js";
import cloudinary from "../config/cloudinary.js";

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




// Get All Authorities
export const getAllAuthorities = async (req, res) => {
  try {
    const authorities = await authorityModel.find();
    res.status(200).json({success:true, authorities});
  } catch (error) {
    res.status(500).json({ message: "Error fetching authorities", error });
  }
};