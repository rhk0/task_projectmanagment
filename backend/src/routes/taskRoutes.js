const express = require("express")
const { body } = require("express-validator")
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Validation rules
const taskValidation = [
  body("title").trim().isLength({ min: 1 }).withMessage("Task title is required"),
  body("projectId").isInt({ min: 1 }).withMessage("Valid project ID is required"),
]

const taskUpdateValidation = [
  body("title").trim().isLength({ min: 1 }).withMessage("Task title is required"),
  body("status").isIn(["pending", "in_progress", "completed"]).withMessage("Invalid status"),
  body("priority").isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
]

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Routes
router.get("/", getTasks)
router.post("/", taskValidation, createTask)
router.put("/:id", taskUpdateValidation, updateTask)
router.delete("/:id", deleteTask)

module.exports = router
