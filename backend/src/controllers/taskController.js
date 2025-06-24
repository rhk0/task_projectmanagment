const { validationResult } = require("express-validator")
const { getConnection } = require("../config/database")

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query
    const connection = getConnection()

    let query = `
      SELECT t.*, p.name as project_name
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.user_id = ?
    `
    const params = [req.userId]

    if (projectId) {
      query += " AND t.project_id = ?"
      params.push(projectId)
    }

    query += " ORDER BY t.created_at DESC"

    const [tasks] = await connection.execute(query, params)
    res.json(tasks)
  } catch (error) {
    console.error("Get tasks error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, description, projectId, priority, dueDate } = req.body
    const connection = getConnection()

    // Verify project belongs to user
    const [projects] = await connection.execute("SELECT * FROM projects WHERE id = ? AND user_id = ?", [
      projectId,
      req.userId,
    ])

    if (projects.length === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    const [result] = await connection.execute(
      "INSERT INTO tasks (title, description, project_id, priority, due_date) VALUES (?, ?, ?, ?, ?)",
      [title, description || "", projectId, priority || "medium", dueDate || null],
    )

    const [newTask] = await connection.execute(
      "SELECT t.*, p.name as project_name FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = ?",
      [result.insertId],
    )

    res.status(201).json(newTask[0])
  } catch (error) {
    console.error("Create task error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

 const updateTask = async (req, res) => {
  console.log("Update task request:", req.body)
  console.log("User ID:", req.userId)
  console.log("Task ID:", req.params.id)

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const {
      id: taskId,
      title = null,
      description = null,
      status = null,
      priority = null,
      due_date: rawDueDate = null,
      project_id: projectId
    } = req.body

    // Convert ISO date-time to YYYY-MM-DD
    const dueDate = rawDueDate ? new Date(rawDueDate).toISOString().split("T")[0] : null

    const connection = getConnection()

    const [results] = await connection.execute(
      `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = NOW() WHERE id = ? AND project_id = ?`,
      [title, description, status, priority, dueDate, taskId, projectId]
    )

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" })
    }

    const [updatedTask] = await connection.execute(
      "SELECT t.*, p.name as project_name FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.id = ?",
      [id]
    )

    res.json(updatedTask[0])
  } catch (error) {
    console.error("Update task error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const connection = getConnection()

    const [result] = await connection.execute(
      `
      DELETE t FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = ? AND p.user_id = ?
    `,
      [id, req.userId],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" })
    }

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Delete task error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask }
