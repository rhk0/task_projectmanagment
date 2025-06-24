"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectList } from "./project-list"
import { TaskList } from "./task-list"
import { CreateProjectDialog } from "./create-project-dialog"
import { CreateTaskDialog } from "./create-task-dialog"
import { useAuth } from "@/components/auth/auth-provider"
import { LogOut, Plus } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  task_count: number
  completed_tasks: number
  created_at: string
}

interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  project_name: string
  due_date: string
  created_at: string
}

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateProject, setShowCreateProject] = useState(false)
  const [showCreateTask, setShowCreateTask] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

 const fetchData = async () => {
  try {
    const token = localStorage.getItem("auth-token")
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    const [projectsRes, tasksRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects`, { headers }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks`, { headers }),
    ])

    if (projectsRes.ok) {
      const projectsData = await projectsRes.json()
      setProjects(projectsData)
    }

    if (tasksRes.ok) {
      const tasksData = await tasksRes.json()
      setTasks(tasksData)
    }
  } catch (error) {
    console.error("Failed to fetch data:", error)
  } finally {
    setLoading(false)
  }
}
  const handleLogout = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const pendingTasks = tasks.filter((task) => task.status === "pending").length
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length
  const completedTasks = tasks.filter((task) => task.status === "completed").length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTasks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressTasks}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTasks}</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>
              <div className="space-x-2">
                <Button onClick={() => setShowCreateProject(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                <Button onClick={() => setShowCreateTask(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </div>
            </div>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Manage your projects and track progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProjectList projects={projects} onUpdate={fetchData} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>View and manage all your tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <TaskList tasks={tasks} onUpdate={fetchData} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <CreateProjectDialog open={showCreateProject} onOpenChange={setShowCreateProject} onSuccess={fetchData} />

      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        projects={projects}
        onSuccess={fetchData}
      />
    </div>
  )
}
