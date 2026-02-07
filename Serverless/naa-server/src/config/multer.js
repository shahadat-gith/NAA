import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage
});


export const excelUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExt = /\.xlsx$|\.xls$|\.csv$/i;
    const allowedMime = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    const extname = allowedExt.test(path.extname(file.originalname));
    const mimetype = allowedMime.includes(file.mimetype);

    if (extname || mimetype) return cb(null, true);
    cb(new Error("Only Excel or CSV files are allowed!"));
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});
