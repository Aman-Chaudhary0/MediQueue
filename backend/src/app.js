import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js"

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);

export default app;
