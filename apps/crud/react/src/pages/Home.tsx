import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchTasks, fetchCategories } from '../api/tasks'

export default function Home() {
  const { data: taskData } = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: () => fetchTasks({ perPage: 1000 }),
  })
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const tasks = taskData?.data || []
  const pending = tasks.filter((t) => t.status === 'pending').length
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length
  const done = tasks.filter((t) => t.status === 'done').length

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-600">{pending}</div>
          <div className="text-sm text-orange-700">Pending</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{inProgress}</div>
          <div className="text-sm text-blue-700">In Progress</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{done}</div>
          <div className="text-sm text-green-700">Done</div>
        </div>
      </div>
      <Link to="/tasks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
        View all tasks →
      </Link>
    </div>
  )
}
