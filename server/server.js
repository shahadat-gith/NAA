import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoDBConnection from "./config/db.js";
import { userRouter } from "./routes/authRoutes.js";
import teacherRouter from "./routes/teacherRoutes.js";
import settingsRouter from "./routes/settingsRouter.js";
import galleryRouter from "./routes/galleryRoutes.js";
import achieversRouter from "./routes/achieversRoute.js";
import studentRouter from "./routes/studentRoute.js";


const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL, "https://naa-client.onrender.com", "http://localhost:5175"];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
mongoDBConnection();

app.use("/api/teacher", teacherRouter);
app.use("/api/auth", userRouter);
app.use("/api/settings",settingsRouter)
app.use("/api/gallery", galleryRouter)
app.use("/api/achievers", achieversRouter)
app.use("/api/student", studentRouter)

app.get("/", (req, res) => res.status(200).json({ message: "API is working!" }));

app.listen(port, () => console.log(`Server working on http://localhost:${port}`));
