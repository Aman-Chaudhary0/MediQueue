import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { uploadImage } from "../contollers/upload.controller.js";

const router = express.Router();

router.post(
  "/image",
  upload.single("image"),
  uploadImage
);

export default router;
