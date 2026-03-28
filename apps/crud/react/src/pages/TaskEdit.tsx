import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTask, updateTask, fetchCategories } from '../api/tasks'
import TaskForm from '../components/TaskForm'
import type { TaskFormData } from '../schemas/task'

export default function TaskEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => fetchTask(Number(id)),
    enabled: !!id,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const mutation = useMutation({
    mutationFn: (data: TaskFormData) => updateTask(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      navigate('/tasks')
    },
  })

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (!task) return <p className="text-gray-500">Task not found</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
      <TaskForm
        categories={categories}
        defaultValues={task}
        onSubmit={(data) => mutation.mutate(data)}
        isSubmitting={mutation.isPending}
      />
    </div>
  )
}
