import { useTaskStore } from '../store/task-store'

interface Props {
  totalCount: number
}

export default function Pagination({ totalCount }: Props) {
  const { filters, setFilter } = useTaskStore()
  const page = filters.page || 1
  const perPage = filters.perPage || 10
  const totalPages = Math.ceil(totalCount / perPage)

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-500">
        Page {page} of {totalPages} ({totalCount} tasks)
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('page', page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => setFilter('page', page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
