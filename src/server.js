const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Body parser
app.use(express.json());

// ✅ STEP 7D — CORS (ADD THIS BLOCK)
app.use(
  cors({
    origin: "https://4tipster-pro-insights.vercel.app",
    credentials: true,
  })
);

// ✅ Routes (AFTER CORS)
app.use("/api/auth", require("./modules/auth/auth.routes"));

// ✅ Health check (optional but useful)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
