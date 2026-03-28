import { useState, useEffect } from 'preact/hooks'
import { route } from 'preact-router'
import { createTask, fetchCategories } from '../api'
import TaskForm from '../components/TaskForm'
import type { TaskFormData } from '../schemas/task'
import type { Category } from '../../../../../shared/types'

export default function TaskCreate() {
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  const handleSubmit = async (data: TaskFormData) => {
    setSubmitting(true)
    try {
      await createTask(data)
      route('/tasks')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Create Task</h1>
      <TaskForm
        categories={categories}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
      />
    </div>
  )
}
