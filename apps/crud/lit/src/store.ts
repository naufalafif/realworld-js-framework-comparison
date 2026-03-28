import type { TaskFilters } from '../../../../shared/types'

const defaultFilters: TaskFilters = {
  status: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  perPage: 10,
}

let _filters: TaskFilters = { ...defaultFilters }
const listeners = new Set<() => void>()

export const getFilters = () => _filters

export const setFilter = <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
  _filters = { ..._filters, [key]: value, ...(key !== 'page' ? { page: 1 } : {}) }
  listeners.forEach((l) => l())
}

export const resetFilters = () => {
  _filters = { ...defaultFilters }
  listeners.forEach((l) => l())
}

export const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => { listeners.delete(fn) }
}
