import express from "express";
import {
  deleteAdmitCardSettings,
  getHeroImages,
  getSettings,
  toggleServiceSetting,
  updateAdmitCardSettings,
  updateHeroImage,
} from "../controller/setting.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import {
  getAllAuthorities,
  updateAuthority,
} from "../controller/authority.controller.js";

import { upload } from "../config/multer.js";

const settingsRouter = express.Router();

settingsRouter.get("/hero-images", getHeroImages);

settingsRouter.post(
  "/hero-images/update",
  adminAuthMiddleware,
  upload.single("image"),
  updateHeroImage
);


settingsRouter.post(
  "/authority",
  adminAuthMiddleware,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  updateAuthority
);

settingsRouter.post("/authorities", getAllAuthorities);

settingsRouter.put(
  "/update",
  adminAuthMiddleware,
  updateAdmitCardSettings
);

settingsRouter.delete(
  "/admitcard/:id",
  adminAuthMiddleware,
  deleteAdmitCardSettings
);

settingsRouter.put(
  "/toggle/:setting",
  adminAuthMiddleware,
  toggleServiceSetting
);


settingsRouter.get("/:type", getSettings);

export default settingsRouter;
