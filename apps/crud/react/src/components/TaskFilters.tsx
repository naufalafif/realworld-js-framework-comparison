import { useTaskStore } from '../store/task-store'
import type { Category } from '../../../../../shared/types'

interface Props {
  categories: Category[]
}

export default function TaskFilters({ categories }: Props) {
  const { filters, setFilter, resetFilters } = useTaskStore()

  return (
    <div className="flex flex-wrap gap-3 items-center mb-6">
      <select
        value={filters.status || 'all'}
        onChange={(e) => setFilter('status', e.target.value as any)}
        className="px-3 py-2 border rounded text-sm bg-white"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters.categoryId || ''}
        onChange={(e) => setFilter('categoryId', e.target.value ? Number(e.target.value) : undefined)}
        className="px-3 py-2 border rounded text-sm bg-white"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={filters.sortBy || 'createdAt'}
        onChange={(e) => setFilter('sortBy', e.target.value as any)}
        className="px-3 py-2 border rounded text-sm bg-white"
      >
        <option value="createdAt">Date Created</option>
        <option value="title">Title</option>
        <option value="priority">Priority</option>
      </select>

      <button
        onClick={() => setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
        className="px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50"
      >
        {filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
      </button>

      <button
        onClick={resetFilters}
        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
      >
        Reset
      </button>
    </div>
  )
}
