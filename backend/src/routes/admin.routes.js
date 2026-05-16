import express from "express";

import {
  registerDoctor,
  getAllUsers,
  getAllDoctors,
  deleteUser,
  getAdminDashboardStats,
  getAdminAnalytics,
} from "../contollers/admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();


// ADMIN ONLY ROUTES
// Register doctor (admin creates)
router.post(
  "/register-doctor",
  protect,
  authorizeRoles("admin"),
  registerDoctor
);


// Get all users
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);

// Get all doctors
router.get(
  "/doctors",
  protect,
  authorizeRoles("admin"),
  getAllDoctors
);

// Delete user
router.delete(
  "/users/:userId",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

// Admin dashboard stats
router.get(
  "/dashboard/stats",
  protect,
  authorizeRoles("admin"),
  getAdminDashboardStats
);

// Admin analytics (charts + cards)
router.get(
  "/analytics",
  protect,
  authorizeRoles("admin"),
  getAdminAnalytics
);

export default router;
