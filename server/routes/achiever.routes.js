import express from 'express';
import { addAchieversDetails, getAchievers, deleteAchiever, updateAchiever } from '../controller/achieversController.js';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../config/multer.js';


const achieversRouter = express.Router();


// Routes
achieversRouter.post('/add-achiever', authMiddleware, upload.single('image'), addAchieversDetails);
achieversRouter.get('/get-achievers', getAchievers); 
achieversRouter.put('/update-achiever/:id', authMiddleware, upload.single('image'), updateAchiever);
achieversRouter.delete('/delete-achievers/:id', authMiddleware, deleteAchiever);

export default achieversRouter;