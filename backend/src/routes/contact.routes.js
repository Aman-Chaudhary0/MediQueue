import express from "express";
import { sendContactMessage } from "../controllers/contact.controller.js";
import { validateContactInput } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// POST - Send contact message
router.post("/send", validateContactInput, sendContactMessage);

export default router;
