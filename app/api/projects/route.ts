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

    const projects = await sql`
      SELECT p.*, 
             COUNT(t.id) as task_count,
             COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.user_id = ${userId}
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUser(request)
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 })
    }

    const newProjects = await sql`
      INSERT INTO projects (name, description, user_id, created_at, updated_at)
      VALUES (${name}, ${description || ""}, ${userId}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json(newProjects[0])
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
