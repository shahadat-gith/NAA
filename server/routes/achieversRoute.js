import express from 'express';
import { addAchieversDetails, getAchievers, deleteAchiever } from '../controller/achieversController.js';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth.js';
import path from 'path';


const achieversRouter = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, and PNG images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

// Routes
achieversRouter.post('/add-achiever', authMiddleware, upload.single('image'), addAchieversDetails);
achieversRouter.get('/get-achievers', getAchievers); 
achieversRouter.delete('/delete-achievers/:id', authMiddleware, deleteAchiever);

export default achieversRouter;