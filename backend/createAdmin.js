import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/medi-queue");
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: admin123");
    console.log("👤 Role: admin");
    console.log("\n💡 Change password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
