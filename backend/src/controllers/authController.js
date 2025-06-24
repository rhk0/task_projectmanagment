const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const { getConnection } = require("../config/database")
console.log("Auth controller loaded", process.env.JWT_SECRET)
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

const signup = async (req, res) => {
  console.log("Signup request body:", req.body)
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body
    const connection = getConnection()

    // Check if user already exists
    const [existingUsers] = await connection.execute("SELECT * FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const [result] = await connection.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ])

    const userId = result.insertId

    // Generate token
    const token = generateToken(userId)

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: userId,
        name,
        email,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    const connection = getConnection()

    // Find user
    const [users] = await connection.execute("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate token
    const token = generateToken(user.id)

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const getProfile = async (req, res) => {
  try {
    const connection = getConnection()
    const [users] = await connection.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", [req.userId])

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user: users[0] })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = { signup, login, getProfile }
