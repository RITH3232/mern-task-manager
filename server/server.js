const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // <-- The new CORS import!
const connectDB = require("./config/db");

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB Database
connectDB();

// Initialize the Express app
const app = express();

// ==========================================
// MIDDLEWARE (The Bouncers)
// ==========================================

// 1. Allows your React frontend (port 5173) to talk to this Node backend (port 5000)
app.use(cors());

// 2. Allows your server to read incoming JSON data (like emails and passwords)
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

// A simple test route so you can check if the API is awake in your browser
app.get("/", (req, res) => {
  res.send("Task Manager API is running successfully!");
});

// Import your actual API routes here
// (Make sure you have these files in your server/routes folder!)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
