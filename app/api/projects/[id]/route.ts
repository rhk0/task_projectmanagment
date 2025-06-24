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
    const { name, description } = await request.json()
    const projectId = params.id

    const updatedProjects = await sql`
      UPDATE projects 
      SET name = ${name}, description = ${description}, updated_at = NOW()
      WHERE id = ${projectId} AND user_id = ${userId}
      RETURNING *
    `

    if (updatedProjects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json(updatedProjects[0])
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await getUser(request)
    const projectId = params.id

    // Delete tasks first (foreign key constraint)
    await sql`DELETE FROM tasks WHERE project_id = ${projectId}`

    // Delete project
    const deletedProjects = await sql`
      DELETE FROM projects 
      WHERE id = ${projectId} AND user_id = ${userId}
      RETURNING *
    `

    if (deletedProjects.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Project deleted successfully" })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
