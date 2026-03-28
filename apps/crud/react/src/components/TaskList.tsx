import { Link } from 'react-router'
import type { Task, Category } from '../../../../../shared/types'

interface Props {
  tasks: Task[]
  categories: Category[]
  onDelete: (id: number) => void
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const statusColors = {
  pending: 'bg-orange-100 text-orange-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

export default function TaskList({ tasks, categories, onDelete }: Props) {
  if (tasks.length === 0) {
    return <p className="text-center text-gray-500 py-8">No tasks found.</p>
  }

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.name || 'Unknown'
  const getCategoryColor = (id: number) => categories.find((c) => c.id === id)?.color || '#gray'

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${statusColors[task.status]}`}>
                  {task.status}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span style={{ color: getCategoryColor(task.categoryId) }}>
                  {getCategoryName(task.categoryId)}
                </span>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Link
                to={`/tasks/${task.id}/edit`}
                className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
              >
                Edit
              </Link>
              <button
                onClick={() => onDelete(task.id)}
                className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
