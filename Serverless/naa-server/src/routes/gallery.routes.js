import express from 'express';
import { upload } from '../config/multer.js';
import { uploadImage, getImages, deleteImage } from '../controller/gallery.controller.js';

const galleryRouter = express.Router();


// Routes
galleryRouter.post('/upload', upload.array('images'), uploadImage);
galleryRouter.get('/', getImages);
galleryRouter.delete('/:public_id(*)', deleteImage); // <-- support slashes in public_id

export default galleryRouter;
