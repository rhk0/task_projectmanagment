"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
 const token = localStorage.getItem("auth-token")
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

interface TaskListProps {
  tasks: Task[]
  onUpdate: () => void
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
}

export function TaskList({ tasks, onUpdate }: TaskListProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const updateTaskStatus = async (id: string, status: string) => {
    setLoading(id)
    try {
      const task = tasks.find((t) => t.id === id)
      if (!task) return

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/${id}`, {
        method: "PUT",
          headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
        body: JSON.stringify({
          ...task,
          status,
        }),
      })
 
      if (response.ok) {
        toast({
          title: "Success",
          description: "Task updated successfully",
        })
        onUpdate()
      } else {
        throw new Error("Failed to update task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const deleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    setLoading(id)
    try {
       
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
              headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Task deleted successfully",
        })
        onUpdate()
      } else {
        throw new Error("Failed to delete task")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks yet. Create your first task!</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell>{task.project_name}</TableCell>
            <TableCell>
              <Badge className={statusColors[task.status]}>{task.status.replace("_", " ")}</Badge>
            </TableCell>
            <TableCell>
              <Badge className={priorityColors[task.priority]}>{task.priority}</Badge>
            </TableCell>
            <TableCell>{task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => updateTaskStatus(task.id, "pending")} disabled={loading === task.id}>
                    Mark as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateTaskStatus(task.id, "in_progress")}
                    disabled={loading === task.id}
                  >
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateTaskStatus(task.id, "completed")}
                    disabled={loading === task.id}
                  >
                    Mark as Completed
                  </DropdownMenuItem>
                   
                  <DropdownMenuItem
                    onClick={() => deleteTask(task.id)}
                    disabled={loading === task.id}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
