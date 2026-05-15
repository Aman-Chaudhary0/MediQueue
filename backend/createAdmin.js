import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in your environment (.env)");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const existingByEmail = await User.findOne({ email: process.env.ADMIN_EMAIL || "myselfamanchaudhary1@gmail.com" });
    if (existingByEmail) {
      console.log("⚠️  Admin/user with this email already exists:", existingByEmail.email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "Aman@1234",
      salt
    );

    const admin = await User.create({
      name: process.env.ADMIN_NAME || "Aman Chaudhary",
      email: process.env.ADMIN_EMAIL || "myselfamanchaudhary1@gmail.com",
      password: hashedPassword,
      role: "admin",
      phone: process.env.ADMIN_PHONE || "9758195321",
      hospital: process.env.ADMIN_HOSPITAL || "N/A",
      profilePic: process.env.ADMIN_PROFILE_PIC_URL || null,
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password:", process.env.ADMIN_PASSWORD || "Aman@1234");
    console.log("👤 Role: admin");
    console.log("\n💡 Change password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
