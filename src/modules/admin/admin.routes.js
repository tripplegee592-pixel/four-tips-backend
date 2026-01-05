const express = require("express");
const router = express.Router();
const adminController = require("./admin.controller");
const { protect, authorize } = require("../../utils/authMiddleware");

// All routes require authentication and ADMIN role
router.use(protect);
router.use(authorize("ADMIN"));

// Dashboard
router.get("/dashboard", adminController.getDashboard);

// User management
router.get("/users", adminController.getAllUsers);
router.put("/users/:userId/role", adminController.updateUserRole);
router.put("/users/:userId/deactivate", adminController.deactivateUser);
router.put("/users/:userId/activate", adminController.activateUser);

// Tips management
router.get("/tips", adminController.getAllTips);
router.put("/tips/:tipId/status", adminController.updateTipStatus);
router.delete("/tips/:tipId", adminController.deleteTip);

module.exports = router;
