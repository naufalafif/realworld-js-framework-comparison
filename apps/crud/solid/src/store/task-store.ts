import { createSignal } from 'solid-js'
import type { TaskFilters } from '../../../../../shared/types'

const defaultFilters: TaskFilters = {
  status: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  perPage: 10,
}

const [filters, setFiltersRaw] = createSignal<TaskFilters>({ ...defaultFilters })

function setFilter<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
  setFiltersRaw((prev) => ({
    ...prev,
    [key]: value,
    ...(key !== 'page' ? { page: 1 } : {}),
  }))
}

function resetFilters() {
  setFiltersRaw({ ...defaultFilters })
}

export { filters, setFilter, resetFilters }
