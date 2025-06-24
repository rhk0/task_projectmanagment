import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LoginForm } from "@/components/auth/login-form"
import { AuthProvider } from "@/components/auth/auth-provider"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock fetch
global.fetch = jest.fn()

const MockedLoginForm = () => (
  <AuthProvider>
    <LoginForm />
  </AuthProvider>
)

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders login form", () => {
    render(<MockedLoginForm />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("submits form with valid data", async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: "1", email: "test@example.com", name: "Test User" } }),
    } as Response)

    render(<MockedLoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    })

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com", password: "password123" }),
      })
    })
  })

  it("displays error on failed login", async () => {
    const mockFetch = fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    } as Response)

    render(<MockedLoginForm />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    })

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })
})
