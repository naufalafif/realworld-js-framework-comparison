import { createResource, createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { createTask, fetchCategories } from '../api/tasks'
import TaskForm from '../components/TaskForm'
import type { TaskFormData } from '../schemas/task'

export default function TaskCreate() {
  const navigate = useNavigate()
  const [categories] = createResource(fetchCategories)
  const [isSubmitting, setIsSubmitting] = createSignal(false)

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true)
    try {
      await createTask(data)
      navigate('/tasks')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Create Task</h1>
      <TaskForm
        categories={categories() || []}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting()}
      />
    </div>
  )
}
