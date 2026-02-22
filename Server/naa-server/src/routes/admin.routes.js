import express from "express";
import { initialData } from "../controller/admin.controller.js";


const adminRouter = express.Router();

adminRouter.get('/initial-data', initialData);

export default adminRouter;