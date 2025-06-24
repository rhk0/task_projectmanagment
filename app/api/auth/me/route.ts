import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string; email: string }

    const users = await sql`
      SELECT id, name, email FROM users WHERE id = ${decoded.userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: users[0] })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
