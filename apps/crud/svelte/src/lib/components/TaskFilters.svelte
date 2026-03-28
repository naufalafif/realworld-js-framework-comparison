<script lang="ts">
  import { filters, setFilter, resetFilters } from '../stores/task-store'
  import type { Category } from '../../../../../shared/types'

  let { categories }: { categories: Category[] } = $props()
</script>

<div class="flex flex-wrap gap-3 items-center mb-6">
  <select value={$filters.status || 'all'} onchange={(e) => setFilter('status', (e.target as HTMLSelectElement).value as any)}
    class="px-3 py-2 border rounded text-sm bg-white">
    <option value="all">All Status</option>
    <option value="pending">Pending</option>
    <option value="in-progress">In Progress</option>
    <option value="done">Done</option>
  </select>

  <select value={$filters.categoryId || ''} onchange={(e) => setFilter('categoryId', (e.target as HTMLSelectElement).value ? Number((e.target as HTMLSelectElement).value) : undefined)}
    class="px-3 py-2 border rounded text-sm bg-white">
    <option value="">All Categories</option>
    {#each categories as c}
      <option value={c.id}>{c.name}</option>
    {/each}
  </select>

  <select value={$filters.sortBy || 'createdAt'} onchange={(e) => setFilter('sortBy', (e.target as HTMLSelectElement).value as any)}
    class="px-3 py-2 border rounded text-sm bg-white">
    <option value="createdAt">Date Created</option>
    <option value="title">Title</option>
    <option value="priority">Priority</option>
  </select>

  <button onclick={() => setFilter('sortOrder', $filters.sortOrder === 'asc' ? 'desc' : 'asc')}
    class="px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50">
    {$filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
  </button>

  <button onclick={resetFilters} class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Reset</button>
</div>
