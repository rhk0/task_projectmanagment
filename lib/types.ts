export interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string
  user_id: string
  created_at: string
  updated_at: string
  task_count?: number
  completed_tasks?: number
}

export interface Task {
  id: string
  title: string
  description: string
  project_id: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  due_date: string | null
  created_at: string
  updated_at: string
  project_name?: string
}

export interface AuthResponse {
  message: string
  user: User
}

export interface ApiError {
  error: string
}
