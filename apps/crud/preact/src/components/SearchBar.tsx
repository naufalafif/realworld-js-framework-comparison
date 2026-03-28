import { useState, useEffect } from 'preact/hooks'
import { filters, setFilter } from '../store/task-store'

export default function SearchBar() {
  const [query, setQuery] = useState(filters.value.search || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter('search', query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <input
      type="text"
      value={query}
      onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
      placeholder="Search tasks..."
      class="w-full px-4 py-2 border rounded text-sm mb-4"
    />
  )
}
