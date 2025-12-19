import express from "express";
import { deleteAdmitCardSettings, getSettings, toggleServiceSetting, updateAdmitCardSettings } from "../controller/setting.controller.js";
import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { getAllAuthorities, updateAuthority } from "../controller/authority.controller.js";
import { upload } from "../config/multer.js";


const settingsRouter = express.Router();

settingsRouter.get("/:type", getSettings);
settingsRouter.put("/update", adminAuthMiddleware, updateAdmitCardSettings);
settingsRouter.put("/toggle/:setting", adminAuthMiddleware, toggleServiceSetting);
settingsRouter.delete("/admitcard/:id", adminAuthMiddleware, deleteAdmitCardSettings);

settingsRouter.post("/authority", 
    adminAuthMiddleware,
    upload.fields([{ name: "image", maxCount: 1 },{ name: "signature", maxCount: 1 },]), 
    updateAuthority);

settingsRouter.post("/authorities", getAllAuthorities);

export default settingsRouter;