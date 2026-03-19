import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;


const uploadImageToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const originalName = file.originalname;
    const fileName = originalName.split(".").slice(0, -1).join(".");

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: fileName,
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};
const uploadPdfToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    const originalName = file.originalname; // e.g. notice.pdf
    const fileName = originalName.split(".").slice(0, -1).join(".");
    const ext = originalName.split(".").pop();

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",

        // 🔥 critical fix
        public_id: fileName,
        format: ext,

        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(file.buffer);
  });
};


const deleteFromCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};


export { uploadImageToCloudinary, deleteFromCloudinary, uploadPdfToCloudinary };