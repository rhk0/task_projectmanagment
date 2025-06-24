const API_BASE_URL = "http://localhost:5000/api"

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("auth-token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "An error occurred")
    }
    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await this.handleResponse(response)
    if (data.token) {
      localStorage.setItem("auth-token", data.token)
    }
    return data
  }

  async signup(name: string, email: string, password: string) {
    console.log("Signing up with:", { name, email, password })
    const response = await fetch(`http://localhost:5000/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || "An error occurred during signup")
    }
    const data = await this.handleResponse(response)
    console.log("Signup response:", data)
    if (data.token) {
      localStorage.setItem("auth-token", data.token)
    }
    return data
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  logout() {
    localStorage.removeItem("auth-token")
  }

  // Project endpoints
  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async createProject(name: string, description: string) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    })
    return this.handleResponse(response)
  }

  async updateProject(id: string, name: string, description: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    })
    return this.handleResponse(response)
  }

  async deleteProject(id: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Task endpoints
  async getTasks(projectId?: string) {
    const url = projectId ? `${API_BASE_URL}/tasks?projectId=${projectId}` : `${API_BASE_URL}/tasks`

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async createTask(taskData: {
    title: string
    description: string
    projectId: string
    priority: string
    dueDate?: string
  }) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    return this.handleResponse(response)
  }

  async updateTask(
    id: string,
    taskData: {
      title: string
      description: string
      status: string
      priority: string
      dueDate?: string
    },
  ) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    })
    return this.handleResponse(response)
  }

  async deleteTask(id: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }
}

export const apiService = new ApiService()
