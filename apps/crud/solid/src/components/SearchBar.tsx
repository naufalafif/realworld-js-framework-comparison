import { createSignal, createEffect, onCleanup } from 'solid-js'
import { filters, setFilter } from '../store/task-store'

export default function SearchBar() {
  const [query, setQuery] = createSignal(filters().search || '')

  createEffect(() => {
    const q = query()
    const timer = setTimeout(() => {
      setFilter('search', q)
    }, 300)
    onCleanup(() => clearTimeout(timer))
  })

  return (
    <input
      type="text"
      value={query()}
      onInput={(e) => setQuery(e.currentTarget.value)}
      placeholder="Search tasks..."
      class="w-full px-4 py-2 border rounded text-sm mb-4"
    />
  )
}
