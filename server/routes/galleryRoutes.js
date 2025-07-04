import express from 'express';
import multer from 'multer';
import { upload } from '../config/multer.js';
import { uploadImage, getImages, deleteImage } from '../controller/galleryController.js';

const galleryRouter = express.Router();


// Routes
galleryRouter.post('/upload', upload.array('images'), uploadImage);
galleryRouter.get('/', getImages);
galleryRouter.delete('/:public_id(*)', deleteImage); // <-- support slashes in public_id

export default galleryRouter;
