const express = require("express");
const router = express.Router();
const usersController = require("./users.controller");
const { protect } = require("../../utils/authMiddleware");

// All routes require authentication
router.use(protect);

// Get current user profile
router.get("/profile", usersController.getProfile);

// Update user profile
router.put("/profile", usersController.updateProfile);

// Change password
router.put("/change-password", usersController.changePassword);

// Delete user account
router.delete("/account", usersController.deleteAccount);

module.exports = router;
