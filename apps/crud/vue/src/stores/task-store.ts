import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { TaskFilters } from '../../../../../shared/types'

export const useTaskStore = defineStore('tasks', () => {
  const filters = reactive<TaskFilters>({
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    perPage: 10,
  })

  function setFilter<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
    (filters as any)[key] = value
    if (key !== 'page') filters.page = 1
  }

  function resetFilters() {
    Object.assign(filters, {
      status: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      perPage: 10,
    })
  }

  return { filters, setFilter, resetFilters }
})
