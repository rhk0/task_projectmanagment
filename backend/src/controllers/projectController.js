const { validationResult } = require("express-validator")
const { getConnection } = require("../config/database")

const getProjects = async (req, res) => {
  try {
    const connection = getConnection()
    const [projects] = await connection.execute(
      `
      SELECT p.*, 
             COUNT(t.id) as task_count,
             COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.user_id = ?
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `,
      [req.userId],
    )

    res.json(projects)
  } catch (error) {
    console.error("Get projects error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const createProject = async (req, res) => {
  
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, description } = req.body
    const connection = getConnection()

    const [result] = await connection.execute("INSERT INTO projects (name, description, user_id) VALUES (?, ?, ?)", [
      name,
      description || "",
      req.userId,
    ])

    const [newProject] = await connection.execute("SELECT * FROM projects WHERE id = ?", [result.insertId])

    res.status(201).json(newProject[0])
  } catch (error) {
    console.error("Create project error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params
    const { name, description } = req.body
    const connection = getConnection()

    const [result] = await connection.execute(
      "UPDATE projects SET name = ?, description = ? WHERE id = ? AND user_id = ?",
      [name, description, id, req.userId],
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    const [updatedProject] = await connection.execute("SELECT * FROM projects WHERE id = ?", [id])

    res.json(updatedProject[0])
  } catch (error) {
    console.error("Update project error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params
    const connection = getConnection()

    // Delete tasks first (foreign key constraint)
    await connection.execute("DELETE FROM tasks WHERE project_id = ?", [id])

    // Delete project
    const [result] = await connection.execute("DELETE FROM projects WHERE id = ? AND user_id = ?", [id, req.userId])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Project not found" })
    }

    res.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = { getProjects, createProject, updateProject, deleteProject }
