const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require("../controllers/taskController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);
router.put("/:id", auth, updateTask); // Full Edit
router.delete("/:id", auth, deleteTask); // Delete
router.patch("/:id/status", auth, updateTaskStatus); // Status Change

module.exports = router;
