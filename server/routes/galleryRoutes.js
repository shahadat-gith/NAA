import express from 'express';
import multer from 'multer';
import { uploadImage, getImages, deleteImage } from '../controller/galleryController.js';

const galleryRouter = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG and PNG images are allowed'));
  },
});

// Routes
galleryRouter.post('/upload', upload.array('images'), uploadImage);
galleryRouter.get('/', getImages);
galleryRouter.delete('/:public_id(*)', deleteImage); // <-- support slashes in public_id

export default galleryRouter;
