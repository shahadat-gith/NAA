import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

// ROUTES
import { userRouter } from "./routes/auth.routes.js";
import teacherRouter from "./routes/teacher.routes.js";
import settingsRouter from "./routes/setting.routes.js";
import galleryRouter from "./routes/gallery.routes.js";
import achieversRouter from "./routes/achiever.routes.js";
import studentRouter from "./routes/student.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import resultRouter from "./routes/result.routes.js";

// MODELS (used in home-data)
import HeroImage from "./models/Settings/heroImages.js";
import { authorityModel } from "./models/Academic/authorities.js";
import { teacherModel } from "./models/Academic/teacher.js";
import Image from "./models/Academic/gallery.js";
import ServiceSettings from "./models/Settings/services.js";

const app = express();

/* ================= CORS CONFIG ================= */

// const allowedOrigins = [
//   process.env.ADMIN_URL,
//   process.env.CLIENT_URL,
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow server-to-server, Postman, curl
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     return callback(null, false); // ❌ DO NOT throw error
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: [
//     "Content-Type",
//     "Authorization",
//     "X-Requested-With",
//   ],
// };

// /* ================= MIDDLEWARES ================= */

// // IMPORTANT: order matters
// app.use(cors(corsOptions));

// // 🔥 REQUIRED for browser preflight on AWS Lambda
// app.options("*", cors(corsOptions));


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());


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

/* ================= CUSTOM API ================= */

app.get("/api/home-data", async (req, res, next) => {
  try {
    const heroImages = await HeroImage.find({});
    const authorities = await authorityModel.find({
      role: { $in: ["Principal", "Managing Director"] },
    });

    const teachers = await teacherModel
      .find({})
      .select("name email contact degree experience image subjectClassMappings");

    const galleryImages = await Image.find({});
    const serviceSettings = await ServiceSettings.findOne({});

    res.status(200).json({
      success: true,
      data: {
        heroImages,
        authorities,
        teachers,
        galleryImages,
        serviceSettings,
      },
    });
  } catch (error) {
    next(error);
  }
});

/* ================= HEALTH ================= */

app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is working!" });
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
