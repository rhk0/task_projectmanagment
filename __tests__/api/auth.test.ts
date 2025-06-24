import { POST as loginPOST } from "@/app/api/auth/login/route"
import { POST as signupPOST } from "@/app/api/auth/signup/route"
import { NextRequest } from "next/server"

// Mock the database
jest.mock("@neondatabase/serverless", () => ({
  neon: jest.fn(() => jest.fn()),
}))

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-token"),
  verify: jest.fn(),
}))

describe("/api/auth/login", () => {
  it("should return 400 for missing credentials", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({}),
    })

    const response = await loginPOST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("Email and password are required")
  })
})

describe("/api/auth/signup", () => {
  it("should return 400 for missing fields", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com" }),
    })

    const response = await signupPOST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("Name, email, and password are required")
  })

  it("should return 400 for short password", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "123",
      }),
    })

    const response = await signupPOST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("Password must be at least 6 characters")
  })
})
