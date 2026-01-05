const express = require("express");
const app = express();
const cors = require("cors");

// Import routes
const authRoutes = require("./modules/auth/auth.routes");
const usersRoutes = require("./modules/users/users.routes");
const tipsRoutes = require("./modules/tips/tips.routes");
const subscriptionsRoutes = require("./modules/subscriptions/subscriptions.routes");
const adminRoutes = require("./modules/admin/admin.routes");

// Middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/tips", tipsRoutes);
app.use("/api/subscriptions", subscriptionsRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

module.exports = app;
