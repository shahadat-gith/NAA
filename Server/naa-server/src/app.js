import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

/* ================= ROUTES ================= */
import { userRouter } from "./routes/auth.routes.js";
import teacherRouter from "./routes/teacher.routes.js";
import settingsRouter from "./routes/setting.routes.js";
import galleryRouter from "./routes/gallery.routes.js";
import achieversRouter from "./routes/achiever.routes.js";
import studentRouter from "./routes/student.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import resultRouter from "./routes/result.routes.js";
import admissionRouter from "./routes/admission.routes.js";
import adminRouter from "./routes/admin.routes.js";
import noticeRouter from "./routes/notice.routes.js";

/* ================= MODELS ================= */
import HeroImage from "./models/Settings/heroImages.js";
import { authorityModel } from "./models/Academic/authorities.js";
import { teacherModel } from "./models/Academic/teacher.js";
import Image from "./models/Academic/gallery.js";
import ServiceSettings from "./models/Settings/services.js";
import Notice from "./models/Academic/notices.js";

const app = express();

// TOP of middleware (before routes)
app.use(cors({
  origin: "*", // or your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Explicit preflight handler (VERY IMPORTANT)
app.options("*", cors());

// 2. Optional cors middleware (fine to keep)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */

app.use("/api/teacher", teacherRouter);
app.use("/api/auth", userRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/achievers", achieversRouter);
app.use("/api/student", studentRouter);
app.use("/api/results", resultRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admission", admissionRouter);
app.use("/api/admin", adminRouter);
app.use("/api/notices", noticeRouter);

/* ================= CUSTOM API ================= */

app.get("/api/home-data", async (req, res, next) => {
  try {
    const [heroImages, authorities, teachers, galleryImages, serviceSettings, notices] = await Promise.all([
      HeroImage.find({}),
      authorityModel.find({ role: { $in: ["Principal", "Managing Director"] } }),
      teacherModel.find({}).select("name email contact degree experience image subjectClassMappings"),
      Image.find({}),
      ServiceSettings.findOne({}),
      Notice.find({}).sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      success: true,
      data: {
        heroImages,
        authorities,
        teachers,
        galleryImages,
        serviceSettings,
        notices,
      },
    });
  } catch (error) {
    next(error);
  }
});

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is working!" });
});

/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;