const express = require("express");
const router = express.Router();
const tipsController = require("./tips.controller");
const { protect, authorize } = require("../../utils/authMiddleware");

// Get all tips (public route)
router.get("/", tipsController.getAllTips);

// Get tip by ID (public route)
router.get("/:id", tipsController.getTip);

// Protected routes
router.use(protect);

// Create tip (only TIPSTER and ADMIN)
router.post("/", authorize("TIPSTER", "ADMIN"), tipsController.createTip);

// Update tip (only owner or ADMIN)
router.put("/:id", authorize("TIPSTER", "ADMIN"), tipsController.updateTip);

// Delete tip (only owner or ADMIN)
router.delete("/:id", authorize("TIPSTER", "ADMIN"), tipsController.deleteTip);

// Add review (any authenticated user)
router.post("/:id/reviews", tipsController.addReview);

module.exports = router;
