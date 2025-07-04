import multer from "multer";
import path from "path";
// Use memory storage for multer to avoid saving files locally
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG and PNG images are allowed!"));
  },
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
});
