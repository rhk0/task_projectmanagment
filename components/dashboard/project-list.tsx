"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Project {
  id: string
  name: string
  description: string
  task_count: number
  completed_tasks: number
  created_at: string
}

interface ProjectListProps {
  projects: Project[]
  onUpdate: () => void
}

export function ProjectList({ projects, onUpdate }: ProjectListProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

 const deleteProject = async (id: string) => {
  if (!confirm("Are you sure you want to delete this project?")) return

  setLoading(id)
  try {
    const token = localStorage.getItem("auth-token")
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (response.ok) {
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
      onUpdate()
    } else {
      throw new Error("Failed to delete project")
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to delete project",
      variant: "destructive",
    })
  } finally {
    setLoading(null)
  }
}

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No projects yet. Create your first project!</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>{project.description || "No description"}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {project.completed_tasks}/{project.task_count} tasks
                </Badge>
                {project.task_count > 0 && (
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(project.completed_tasks / project.task_count) * 100}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
               
                  <DropdownMenuItem
                    onClick={() => deleteProject(project.id)}
                    disabled={loading === project.id}
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
