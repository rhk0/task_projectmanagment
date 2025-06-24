const express = require("express")
const { body } = require("express-validator")
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectController")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Validation rules
const projectValidation = [body("name").trim().isLength({ min: 1 }).withMessage("Project name is required")]

// Apply authentication middleware to all routes
router.use(authenticateToken)

// Routes
router.get("/", getProjects)
router.post("/", projectValidation, createProject)
router.put("/:id", projectValidation, updateProject)
router.delete("/:id", deleteProject)

module.exports = router
