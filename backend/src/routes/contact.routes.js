import express from "express";
import { sendContactMessage } from "../contollers/contact.controller.js";

const router = express.Router();

// POST - Send contact message
router.post("/send", sendContactMessage);

export default router;
