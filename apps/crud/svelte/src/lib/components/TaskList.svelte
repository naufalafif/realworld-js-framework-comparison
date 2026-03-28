<script lang="ts">
  import type { Task, Category } from '../../../../../shared/types'

  let { tasks, categories, ondelete }: {
    tasks: Task[]
    categories: Category[]
    ondelete: (id: number) => void
  } = $props()

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    'in-progress': 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
  }

  function getCategoryName(id: number) {
    return categories.find((c) => c.id === id)?.name || 'Unknown'
  }

  function getCategoryColor(id: number) {
    return categories.find((c) => c.id === id)?.color || 'gray'
  }
</script>

{#if tasks.length === 0}
  <p class="text-center text-gray-500 py-8">No tasks found.</p>
{:else}
  <div class="space-y-3">
    {#each tasks as task (task.id)}
      <div class="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-medium text-gray-900">{task.title}</h3>
              <span class="text-xs px-2 py-0.5 rounded {statusColors[task.status]}">{task.status}</span>
              <span class="text-xs px-2 py-0.5 rounded {priorityColors[task.priority]}">{task.priority}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">{task.description}</p>
            <div class="flex items-center gap-3 text-xs text-gray-400">
              <span style="color: {getCategoryColor(task.categoryId)}">{getCategoryName(task.categoryId)}</span>
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div class="flex gap-2 ml-4">
            <a href="/tasks/{task.id}/edit" class="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Edit</a>
            <button onclick={() => ondelete(task.id)} class="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100">Delete</button>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
