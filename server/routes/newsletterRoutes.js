import express from 'express'
import { getAllNewsletters, sendPromotionalMessage, subscribeToNewsletter } from '../controller/newsletterController.js';
import { authMiddleware } from '../middleware/auth.js';

const newsLetterrouter = express.Router();
newsLetterrouter.post("/subscribe", subscribeToNewsletter);
newsLetterrouter.get("/get-all-newsletters",authMiddleware, getAllNewsletters);
newsLetterrouter.post("/send-promotion",authMiddleware,sendPromotionalMessage)

export default newsLetterrouter