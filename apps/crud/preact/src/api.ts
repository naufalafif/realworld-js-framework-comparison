const API = 'http://localhost:3100'

import type { Task, Category } from '../../../../shared/types'

export async function fetchTasks(params: Record<string, string | number | undefined> = {}) {
  const filterParams = new URLSearchParams()
  const fieldFilters = ['status', 'categoryId', 'priority']
  for (const key of fieldFilters) {
    const val = params[key]
    if (val !== undefined && val !== '' && val !== 'all') {
      filterParams.set(key, String(val))
    }
  }

  const res = await fetch(`${API}/tasks?${filterParams}`)
  let data: Task[] = await res.json()

  // Client-side search
  const q = params.q || params.search
  if (q && typeof q === 'string' && q.trim()) {
    const lower = q.toLowerCase()
    data = data.filter(
      (t) => t.title.toLowerCase().includes(lower) || t.description.toLowerCase().includes(lower),
    )
  }

  const totalCount = data.length

  // Client-side sort
  const sortBy = (params._sort || params.sortBy || 'createdAt') as keyof Task
  const sortOrder = params._order || params.sortOrder || 'desc'
  data.sort((a, b) => {
    const aVal = a[sortBy] ?? ''
    const bVal = b[sortBy] ?? ''
    const cmp = String(aVal).localeCompare(String(bVal))
    return sortOrder === 'asc' ? cmp : -cmp
  })

  // Client-side pagination
  const page = Number(params._page || params.page || 1)
  const perPage = Number(params._per_page || params.perPage || 10)
  const start = (page - 1) * perPage
  data = data.slice(start, start + perPage)

  return { data, totalCount }
}

export async function fetchTask(id: number): Promise<Task> {
  const res = await fetch(`${API}/tasks/${id}`)
  return res.json()
}

export async function createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  const now = new Date().toISOString()
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, createdAt: now, updatedAt: now }),
  })
  return res.json()
}

export async function updateTask(id: number, task: Partial<Task>): Promise<Task> {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...task, updatedAt: new Date().toISOString() }),
  })
  return res.json()
}

export async function deleteTask(id: number): Promise<void> {
  await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${API}/categories`)
  return res.json()
}
