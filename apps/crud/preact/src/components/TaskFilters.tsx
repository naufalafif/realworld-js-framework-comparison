import { filters, setFilter, resetFilters } from '../store/task-store'
import type { Category } from '../../../../../shared/types'

interface Props {
  categories: Category[]
}

export default function TaskFilters({ categories }: Props) {
  const f = filters.value

  return (
    <div class="flex flex-wrap gap-3 items-center mb-6">
      <select
        value={f.status || 'all'}
        onChange={(e) => setFilter('status', (e.target as HTMLSelectElement).value as any)}
        class="px-3 py-2 border rounded text-sm bg-white"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={f.categoryId || ''}
        onChange={(e) => {
          const val = (e.target as HTMLSelectElement).value
          setFilter('categoryId', val ? Number(val) : undefined)
        }}
        class="px-3 py-2 border rounded text-sm bg-white"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={f.sortBy || 'createdAt'}
        onChange={(e) => setFilter('sortBy', (e.target as HTMLSelectElement).value as any)}
        class="px-3 py-2 border rounded text-sm bg-white"
      >
        <option value="createdAt">Date Created</option>
        <option value="title">Title</option>
        <option value="priority">Priority</option>
      </select>

      <button
        onClick={() => setFilter('sortOrder', f.sortOrder === 'asc' ? 'desc' : 'asc')}
        class="px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50"
      >
        {f.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
      </button>

      <button
        onClick={resetFilters}
        class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
      >
        Reset
      </button>
    </div>
  )
}
