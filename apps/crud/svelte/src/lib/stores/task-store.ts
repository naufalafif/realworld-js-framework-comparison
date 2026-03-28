import { writable, derived } from 'svelte/store'
import type { TaskFilters } from '../../../../../shared/types'

const defaultFilters: TaskFilters = {
  status: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  perPage: 10,
}

export const filters = writable<TaskFilters>({ ...defaultFilters })

export function setFilter<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
  filters.update((f) => ({
    ...f,
    [key]: value,
    ...(key !== 'page' ? { page: 1 } : {}),
  }))
}

export function resetFilters() {
  filters.set({ ...defaultFilters })
}
