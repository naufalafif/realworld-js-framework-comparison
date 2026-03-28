import { signal } from '@preact/signals'
import type { TaskFilters } from '../../../../../shared/types'

const defaultFilters: TaskFilters = {
  status: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  perPage: 10,
}

export const filters = signal<TaskFilters>({ ...defaultFilters })

export function setFilter<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
  filters.value = {
    ...filters.value,
    [key]: value,
    ...(key !== 'page' ? { page: 1 } : {}),
  }
}

export function resetFilters() {
  filters.value = { ...defaultFilters }
}
