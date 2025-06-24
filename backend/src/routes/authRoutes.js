const express = require("express")
const { body } = require("express-validator")
const { signup, login, getProfile } = require("../controllers/authController")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Validation rules
const signupValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
]

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

// Routes
router.post("/signup", signupValidation, signup)
router.post("/login", loginValidation, login)
router.get("/profile", authenticateToken, getProfile)

module.exports = router
