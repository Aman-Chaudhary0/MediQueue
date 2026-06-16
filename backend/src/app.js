import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import forgotPasswordOtpRoutes from "./routes/forgotPasswordOtp.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware.js";
import { sanitizeRequest } from "./middlewares/validationMiddleware.js";

const app = express();

// Build allowed origins list from FRONTEND_URL env (supports comma-separated multiple URLs)
const buildAllowedOrigins = () => {
  const raw = process.env.FRONTEND_URL || "http://localhost:5173";
  return raw.split(",").map((u) => u.trim()).filter(Boolean);
};

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(sanitizeRequest);

// Health check — MUST be before notFoundHandler
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", forgotPasswordOtpRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
