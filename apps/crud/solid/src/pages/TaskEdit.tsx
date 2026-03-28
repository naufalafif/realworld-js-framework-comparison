import { createResource, createSignal, Show } from 'solid-js'
import { useNavigate, useParams } from '@solidjs/router'
import { fetchTask, updateTask, fetchCategories } from '../api/tasks'
import TaskForm from '../components/TaskForm'
import type { TaskFormData } from '../schemas/task'

export default function TaskEdit() {
  const params = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = createSignal(false)

  const [task] = createResource(() => Number(params.id), fetchTask)
  const [categories] = createResource(fetchCategories)

  const handleSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true)
    try {
      await updateTask(Number(params.id), data)
      navigate('/tasks')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
      <Show
        when={!task.loading && task()}
        fallback={<p class="text-gray-500">Loading...</p>}
      >
        {(taskData) => (
          <TaskForm
            categories={categories() || []}
            defaultValues={taskData()}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting()}
          />
        )}
      </Show>
    </div>
  )
}
