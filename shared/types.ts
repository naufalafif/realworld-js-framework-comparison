// Benchmark result types
export interface BenchmarkResult {
  name: string
  framework: 'react' | 'vue' | 'svelte' | 'solid'
  app: 'perf-stress' | 'crud' | 'xterm'
  metrics: {
    duration_ms: number
    memory_before_kb?: number
    memory_after_kb?: number
    fps?: number
  }
  runs: number
  timestamp: string
}

// CRUD app types
export interface Task {
  id: number
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  categoryId: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  color: string
}

export interface TaskFilters {
  status?: Task['status'] | 'all'
  categoryId?: number
  search?: string
  sortBy?: 'createdAt' | 'title' | 'priority'
  sortOrder?: 'asc' | 'desc'
  page?: number
  perPage?: number
}

// Perf stress test types
export interface PerfRow {
  id: number
  label: string
  selected: boolean
}
