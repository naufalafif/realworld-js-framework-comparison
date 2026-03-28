<script lang="ts">
  import { taskSchema, type TaskFormData } from '../schemas/task'
  import type { Category } from '../../../../../shared/types'

  let { categories, defaultValues, isSubmitting = false, onsubmit: onsubmitProp }: {
    categories: Category[]
    defaultValues?: Partial<TaskFormData>
    isSubmitting?: boolean
    onsubmit: (data: TaskFormData) => void
  } = $props()

  let form = $state<TaskFormData>({
    title: defaultValues?.title || '',
    description: defaultValues?.description || '',
    status: defaultValues?.status || 'pending',
    priority: defaultValues?.priority || 'medium',
    categoryId: defaultValues?.categoryId || 1,
  })

  let errors = $state<Record<string, string>>({})

  function handleSubmit(e: Event) {
    e.preventDefault()
    const result = taskSchema.safeParse(form)
    if (!result.success) {
      errors = {}
      for (const issue of result.error.issues) {
        errors[issue.path[0] as string] = issue.message
      }
      return
    }
    errors = {}
    onsubmitProp(result.data)
  }
</script>

<form onsubmit={handleSubmit} class="space-y-4 max-w-lg">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
    <input bind:value={form.title} class="w-full px-3 py-2 border rounded text-sm" />
    {#if errors.title}<p class="text-red-500 text-xs mt-1">{errors.title}</p>{/if}
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
    <textarea bind:value={form.description} rows={3} class="w-full px-3 py-2 border rounded text-sm"></textarea>
    {#if errors.description}<p class="text-red-500 text-xs mt-1">{errors.description}</p>{/if}
  </div>

  <div class="grid grid-cols-3 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select bind:value={form.status} class="w-full px-3 py-2 border rounded text-sm bg-white">
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
      <select bind:value={form.priority} class="w-full px-3 py-2 border rounded text-sm bg-white">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
      <select bind:value={form.categoryId} class="w-full px-3 py-2 border rounded text-sm bg-white">
        {#each categories as c}
          <option value={c.id}>{c.name}</option>
        {/each}
      </select>
    </div>
  </div>

  <button type="submit" disabled={isSubmitting}
    class="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
    {isSubmitting ? 'Saving...' : 'Save Task'}
  </button>
</form>
