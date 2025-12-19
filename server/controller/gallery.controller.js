import cloudinary from '../config/cloudinary.js';
import Image from '../models/Academic/gallery.js';

export const uploadImage = async (req, res) => {
  try {
    const files = Array.isArray(req.files) ? req.files : req.file ? [req.file] : [];
    if (!files.length) {
      return res.status(400).json({ success: false, message: 'No images provided' });
    }

    const uploadPromises = files.map(file => 
      new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'school-gallery',
            resource_type: 'image',
            format: 'webp', // Optimize for web
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(file.buffer);
      })
    );

    const results = await Promise.all(uploadPromises);

    const imageDocs = results.map(result => ({
      public_id: result.public_id,
      url: result.secure_url,
      createdAt: new Date(),
    }));

    await Image.insertMany(imageDocs);

    res.status(201).json({ 
      success: true,
      message: 'Images uploaded successfully', 
      urls: results.map(result => result.secure_url),
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

export const getImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const images = await Image.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalImages = await Image.countDocuments();
    const hasMore = skip + images.length < totalImages;

    res.status(200).json({ 
      success: true, 
      images, 
      hasMore,
      page,
      totalImages, // Ensure this is included
      totalPages: Math.ceil(totalImages / limit),
    });
  } catch (error) {
    console.error('Fetch images error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch images', error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.params;

    const image = await Image.findOne({ public_id });
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await cloudinary.uploader.destroy(public_id, { resource_type: 'image' });
    await Image.deleteOne({ public_id });

    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image', error: error.message });
  }
};