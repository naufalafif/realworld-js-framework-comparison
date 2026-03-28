import { useState, useEffect } from 'preact/hooks'
import { fetchTasks, fetchCategories } from '../api'
import type { Task } from '../../../../../shared/types'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks({ perPage: 1000 })
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false))
  }, [])

  const pending = tasks.filter((t) => t.status === 'pending').length
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length
  const done = tasks.filter((t) => t.status === 'done').length

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      {loading ? (
        <p class="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        <>
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div class="text-2xl font-bold text-orange-600">{pending}</div>
              <div class="text-sm text-orange-700">Pending</div>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="text-2xl font-bold text-blue-600">{inProgress}</div>
              <div class="text-sm text-blue-700">In Progress</div>
            </div>
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="text-2xl font-bold text-green-600">{done}</div>
              <div class="text-sm text-green-700">Done</div>
            </div>
          </div>
          <a href="/tasks" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View all tasks →
          </a>
        </>
      )}
    </div>
  )
}
