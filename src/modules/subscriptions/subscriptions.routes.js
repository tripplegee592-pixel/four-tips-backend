const express = require("express");
const router = express.Router();
const subscriptionsController = require("./subscriptions.controller");
const { protect } = require("../../utils/authMiddleware");

// All routes require authentication
router.use(protect);

// Subscribe to a tipster
router.post("/subscribe", subscriptionsController.subscribe);

// Unsubscribe from a tipster
router.post("/unsubscribe", subscriptionsController.unsubscribe);

// Get my subscriptions (tipsters I follow)
router.get("/my-subscriptions", subscriptionsController.getMySubscriptions);

// Get my subscribers (users following me)
router.get("/my-subscribers", subscriptionsController.getMySubscribers);

// Check subscription status with a specific tipster
router.get("/status/:tipsterId", subscriptionsController.checkSubscriptionStatus);

module.exports = router;
