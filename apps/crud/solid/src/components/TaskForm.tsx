import { createSignal, For } from 'solid-js'
import { taskSchema, type TaskFormData } from '../schemas/task'
import type { Category } from '../../../../../shared/types'

interface Props {
  categories: Category[]
  defaultValues?: Partial<TaskFormData>
  onSubmit: (data: TaskFormData) => void
  isSubmitting?: boolean
}

export default function TaskForm(props: Props) {
  const [title, setTitle] = createSignal(props.defaultValues?.title || '')
  const [description, setDescription] = createSignal(props.defaultValues?.description || '')
  const [status, setStatus] = createSignal(props.defaultValues?.status || 'pending')
  const [priority, setPriority] = createSignal(props.defaultValues?.priority || 'medium')
  const [categoryId, setCategoryId] = createSignal(props.defaultValues?.categoryId || 1)
  const [errors, setErrors] = createSignal<Record<string, string>>({})

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const formData = {
      title: title(),
      description: description(),
      status: status(),
      priority: priority(),
      categoryId: categoryId(),
    }

    const result = taskSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string
        fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    props.onSubmit(result.data)
  }

  return (
    <form onSubmit={handleSubmit} class="space-y-4 max-w-lg">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={title()}
          onInput={(e) => setTitle(e.currentTarget.value)}
          class="w-full px-3 py-2 border rounded text-sm"
        />
        {errors().title && <p class="text-red-500 text-xs mt-1">{errors().title}</p>}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description()}
          onInput={(e) => setDescription(e.currentTarget.value)}
          rows={3}
          class="w-full px-3 py-2 border rounded text-sm"
        />
        {errors().description && <p class="text-red-500 text-xs mt-1">{errors().description}</p>}
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status()}
            onChange={(e) => setStatus(e.currentTarget.value as TaskFormData['status'])}
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
            value={priority()}
            onChange={(e) => setPriority(e.currentTarget.value as TaskFormData['priority'])}
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
            value={categoryId()}
            onChange={(e) => setCategoryId(Number(e.currentTarget.value))}
            class="w-full px-3 py-2 border rounded text-sm bg-white"
          >
            <For each={props.categories}>
              {(c) => <option value={c.id}>{c.name}</option>}
            </For>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={props.isSubmitting}
        class="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {props.isSubmitting ? 'Saving...' : 'Save Task'}
      </button>
    </form>
  )
}
