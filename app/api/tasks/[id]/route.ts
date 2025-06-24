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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUser(request)
    const { title, description, status, priority, dueDate } = await request.json()
    const taskId = params.id

    const updatedTasks = await sql`
      UPDATE tasks 
      SET title = ${title}, 
          description = ${description}, 
          status = ${status}, 
          priority = ${priority}, 
          due_date = ${dueDate},
          updated_at = NOW()
      FROM projects p
      WHERE tasks.id = ${taskId} 
        AND tasks.project_id = p.id 
        AND p.user_id = ${userId}
      RETURNING tasks.*
    `

    if (updatedTasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(updatedTasks[0])
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUser(request)
    const taskId = params.id

    const deletedTasks = await sql`
      DELETE FROM tasks 
      USING projects p
      WHERE tasks.id = ${taskId} 
        AND tasks.project_id = p.id 
        AND p.user_id = ${userId}
      RETURNING tasks.*
    `

    if (deletedTasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
