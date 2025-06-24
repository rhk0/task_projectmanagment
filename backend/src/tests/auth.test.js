const request = require("supertest")
const { expect } = require("chai")
const app = require("../../server")

describe("Authentication Endpoints", () => {
  describe("POST /api/auth/signup", () => {
    it("should create a new user with valid data", async () => {
      const userData = {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "password123",
      }

      const response = await request(app).post("/api/auth/signup").send(userData).expect(201)

      expect(response.body).to.have.property("token")
      expect(response.body).to.have.property("user")
      expect(response.body.user.email).to.equal(userData.email)
    })

    it("should return 400 for invalid email", async () => {
      const userData = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/signup").send(userData).expect(400)

      expect(response.body).to.have.property("errors")
    })

    it("should return 400 for short password", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "123",
      }

      const response = await request(app).post("/api/auth/signup").send(userData).expect(400)

      expect(response.body).to.have.property("errors")
    })
  })

  describe("POST /api/auth/login", () => {
    it("should return 400 for missing credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({}).expect(400)

      expect(response.body).to.have.property("errors")
    })

    it("should return 401 for invalid credentials", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "wrongpassword",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(401)

      expect(response.body).to.have.property("error")
    })
  })
})
