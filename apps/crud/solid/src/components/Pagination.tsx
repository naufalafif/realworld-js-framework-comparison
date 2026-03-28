import { Show } from 'solid-js'
import { filters, setFilter } from '../store/task-store'

interface Props {
  totalCount: number
}

export default function Pagination(props: Props) {
  const page = () => filters().page || 1
  const perPage = () => filters().perPage || 10
  const totalPages = () => Math.ceil(props.totalCount / perPage())

  return (
    <Show when={totalPages() > 1}>
      <div class="flex items-center justify-between mt-6">
        <p class="text-sm text-gray-500">
          Page {page()} of {totalPages()} ({props.totalCount} tasks)
        </p>
        <div class="flex gap-2">
          <button
            onClick={() => setFilter('page', page() - 1)}
            disabled={page() <= 1}
            class="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setFilter('page', page() + 1)}
            disabled={page() >= totalPages()}
            class="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </Show>
  )
}
