import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function getUser(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    throw new Error("No token provided")
  }

  const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string }
  return decoded.userId
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUser(request)
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    let tasks
    if (projectId) {
      tasks = await sql`
        SELECT t.*, p.name as project_name
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE t.project_id = ${projectId} AND p.user_id = ${userId}
        ORDER BY t.created_at DESC
      `
    } else {
      tasks = await sql`
        SELECT t.*, p.name as project_name
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        WHERE p.user_id = ${userId}
        ORDER BY t.created_at DESC
      `
    }

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUser(request)
    const { title, description, projectId, priority, dueDate } = await request.json()

    if (!title || !projectId) {
      return NextResponse.json({ error: "Title and project ID are required" }, { status: 400 })
    }

    // Verify project belongs to user
    const projects = await sql`
      SELECT * FROM projects WHERE id = ${projectId} AND user_id = ${userId}
    `

    if (projects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const newTasks = await sql`
      INSERT INTO tasks (title, description, project_id, priority, due_date, status, created_at, updated_at)
      VALUES (${title}, ${description || ""}, ${projectId}, ${priority || "medium"}, ${dueDate}, 'pending', NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(newTasks[0])
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
