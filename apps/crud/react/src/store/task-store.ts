import { create } from 'zustand'
import type { TaskFilters } from '../../../../../shared/types'

interface TaskStore {
  filters: TaskFilters
  setFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void
  resetFilters: () => void
}

const defaultFilters: TaskFilters = {
  status: 'all',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  perPage: 10,
}

export const useTaskStore = create<TaskStore>((set) => ({
  filters: { ...defaultFilters },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value, ...(key !== 'page' ? { page: 1 } : {}) },
    })),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
}))
