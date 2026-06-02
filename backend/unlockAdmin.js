import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "./src/models/user.model.js";

async function unlockAdmin() {
  try {
    console.log("\n📍 Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    console.log("\n🔓 Unlocking admin account...");
    console.log("Email: myselfamanchaudhary1@gmail.com");

    const result = await User.updateOne(
      { email: "myselfamanchaudhary1@gmail.com" },
      {
        $set: {
          failedLoginAttempts: 0,
          lockUntil: null,
        },
      }
    );

    console.log("Update result:", result);

    if (result.modifiedCount > 0) {
      console.log("✓ Admin account unlocked successfully!");
      console.log("You can now login with your email and password.");
    } else if (result.matchedCount > 0) {
      console.log("⚠️  Account was already unlocked.");
    } else {
      console.log("⚠️  No account found with that email.");
    }

    await mongoose.disconnect();
    console.log("\n✓ Done!");
    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

unlockAdmin();
