import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongoDBConnection from "./config/db.js";
import adminRouter from "./routes/adminRoutes.js";
import resultRouter from "./routes/resultRoutes.js";
import queryRouter from "./routes/queryRoutes.js";
import { userRouter } from "./routes/authRoutes.js";
import teacherRouter from "./routes/teacherRoutes.js";
import newsLetterRouter from "./routes/newsletterRoutes.js";
import settingsRouter from "./routes/settingsRouter.js";
import taskRouter from "./routes/taskRoutes.js";
import StudentRouter from "./routes/StudentRoutes.js";
import galleryRouter from "./routes/galleryRoutes.js";
import achieversRouter from "./routes/achieversRoute.js";

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [process.env.CLIENT_URL, process.env.ADMIN_URL, "https://naa-client.onrender.com"];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
mongoDBConnection();

app.use("/api/admin", adminRouter);
app.use("/api/result", resultRouter);
app.use("/api/query", queryRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/auth", userRouter);
app.use("/api/newsletter", newsLetterRouter);
app.use("/api/settings",settingsRouter)
app.use("/api/task",taskRouter)
app.use("/api/students", StudentRouter);
app.use("/api/gallery", galleryRouter)
app.use("/api/achievers", achieversRouter)

app.get("/", (req, res) => res.status(200).json({ message: "API is working!" }));

app.listen(port, () => console.log(`Server working on http://localhost:${port}`));
