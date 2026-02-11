import express from "express";
import {
  deleteAdmitCard,
  getSettings,
  toggleServiceSetting,
  updateAdmitCard,
  updateAuthority,
  updateHeroImage,
  upsertExam,
} from "../controller/setting.controller.js";

import { adminAuthMiddleware } from "../middleware/adminAuth.js";
import { upload } from "../config/multer.js";

const settingsRouter = express.Router();


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


settingsRouter.put(
  "/update",
  adminAuthMiddleware,
  updateAdmitCard
);

settingsRouter.delete(
  "/admitcard/:id",
  adminAuthMiddleware,
  deleteAdmitCard
);

settingsRouter.put(
  "/toggle/:setting",
  adminAuthMiddleware,
  toggleServiceSetting
);

settingsRouter.post("/exam/upsert", adminAuthMiddleware, upsertExam);


settingsRouter.get("/", getSettings);

export default settingsRouter;
