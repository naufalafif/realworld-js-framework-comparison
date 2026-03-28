import { For } from 'solid-js'
import { filters, setFilter, resetFilters } from '../store/task-store'
import type { Category } from '../../../../../shared/types'

interface Props {
  categories: Category[]
}

export default function TaskFilters(props: Props) {
  return (
    <div class="flex flex-wrap gap-3 items-center mb-6">
      <select
        value={filters().status || 'all'}
        onChange={(e) => setFilter('status', e.currentTarget.value as any)}
        class="px-3 py-2 border rounded text-sm bg-white"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters().categoryId || ''}
        onChange={(e) => setFilter('categoryId', e.currentTarget.value ? Number(e.currentTarget.value) : undefined)}
        class="px-3 py-2 border rounded text-sm bg-white"
      >
        <option value="">All Categories</option>
        <For each={props.categories}>
          {(c) => <option value={c.id}>{c.name}</option>}
        </For>
      </select>

      <select
        value={filters().sortBy || 'createdAt'}
        onChange={(e) => setFilter('sortBy', e.currentTarget.value as any)}
        class="px-3 py-2 border rounded text-sm bg-white"
      >
        <option value="createdAt">Date Created</option>
        <option value="title">Title</option>
        <option value="priority">Priority</option>
      </select>

      <button
        onClick={() => setFilter('sortOrder', filters().sortOrder === 'asc' ? 'desc' : 'asc')}
        class="px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50"
      >
        {filters().sortOrder === 'asc' ? '\u2191 Asc' : '\u2193 Desc'}
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
