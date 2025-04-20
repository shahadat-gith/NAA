import express from "express";
import { getSettings, updateSettings, updateAdmitCardConfig } from "../controller/settingsController.js";

const settingsRouter = express.Router();

settingsRouter.get("/settings", getSettings);
settingsRouter.put("/update", updateSettings);
settingsRouter.put("/admitcard/update-admitcard", updateAdmitCardConfig);

export default settingsRouter;