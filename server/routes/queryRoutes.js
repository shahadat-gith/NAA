import express from "express"
import { admissionQueryReply, contactQueryReply, getAllAdmissionQueries, getAllContactQueries, submitAdmissionQuery,submitContactQuery } from "../controller/queryController.js"
import { authMiddleware } from "../middleware/auth.js";
const queryRouter = express.Router();


queryRouter.post("/submit-contact-query", submitContactQuery)
queryRouter.get("/get-contact-queries",authMiddleware, getAllContactQueries)
queryRouter.post("/submit-admission-query", submitAdmissionQuery)
queryRouter.get('/get-admission-queries',authMiddleware, getAllAdmissionQueries)
queryRouter.put('/reply-contact-query/:id', authMiddleware,contactQueryReply)
queryRouter.put('/reply-admission-query/:id',authMiddleware, admissionQueryReply)

export default queryRouter;