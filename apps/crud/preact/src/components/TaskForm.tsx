import { useState } from 'preact/hooks'
import { taskSchema, type TaskFormData } from '../schemas/task'
import type { Category } from '../../../../../shared/types'

interface Props {
  categories: Category[]
  defaultValues?: Partial<TaskFormData>
  onSubmit: (data: TaskFormData) => void
  isSubmitting?: boolean
}

export default function TaskForm({ categories, defaultValues, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    categoryId: 1,
    ...defaultValues,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof TaskFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const result = taskSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }
    onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4 max-w-lg">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={formData.title}
          onInput={(e) => handleChange('title', (e.target as HTMLInputElement).value)}
          class="w-full px-3 py-2 border rounded text-sm"
        />
        {errors.title && <p class="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={formData.description}
          onInput={(e) => handleChange('description', (e.target as HTMLTextAreaElement).value)}
          rows={3}
          class="w-full px-3 py-2 border rounded text-sm"
        />
        {errors.description && <p class="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', (e.target as HTMLSelectElement).value)}
            class="w-full px-3 py-2 border rounded text-sm bg-white"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', (e.target as HTMLSelectElement).value)}
            class="w-full px-3 py-2 border rounded text-sm bg-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', Number((e.target as HTMLSelectElement).value))}
            class="w-full px-3 py-2 border rounded text-sm bg-white"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        class="px-6 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Task'}
      </button>
    </form>
  )
}
