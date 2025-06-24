const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const authRoutes = require("./src/routes/authRoutes")
const projectRoutes = require("./src/routes/projectRoutes")
const taskRoutes = require("./src/routes/taskRoutes")
const { connectDB } = require("./src/config/database")

const app = express()
const PORT = process.env.PORT || 5000
 
app.use(helmet())

 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 100,  
})
app.use(limiter)

 
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

 
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

 
app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)
app.use("/api/tasks", taskRoutes)

 
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

 
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  })
})

 
const startServer = async () => {
  try {
    await connectDB()
    console.log("Database connected successfully")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

module.exports = app
