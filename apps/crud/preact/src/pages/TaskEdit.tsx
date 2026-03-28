import { useState, useEffect } from 'preact/hooks'
import { route } from 'preact-router'
import { fetchTask, updateTask, fetchCategories } from '../api'
import TaskForm from '../components/TaskForm'
import type { TaskFormData } from '../schemas/task'
import type { Task, Category } from '../../../../../shared/types'

interface Props {
  id?: string
}

export default function TaskEdit({ id }: Props) {
  const [task, setTask] = useState<Task | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!id) return
    Promise.all([fetchTask(Number(id)), fetchCategories()])
      .then(([t, cats]) => {
        setTask(t)
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data: TaskFormData) => {
    if (!id) return
    setSubmitting(true)
    try {
      await updateTask(Number(id), data)
      route('/tasks')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p class="text-gray-500">Loading...</p>
  if (!task) return <p class="text-gray-500">Task not found</p>

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
      <TaskForm
        categories={categories}
        defaultValues={task}
        onSubmit={handleSubmit}
        isSubmitting={submitting}
      />
    </div>
  )
}
