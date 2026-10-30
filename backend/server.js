const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to ORVIX Backend!",
    status: "Server is running successfully",
  });
});

// Test API
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ORVIX API is working!",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`ORVIX server running at http://localhost:${PORT}`);
});