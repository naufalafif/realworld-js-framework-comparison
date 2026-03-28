import { useState, useEffect } from 'react'
import { useTaskStore } from '../store/task-store'

export default function SearchBar() {
  const { filters, setFilter } = useTaskStore()
  const [query, setQuery] = useState(filters.search || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter('search', query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, setFilter])

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search tasks..."
      className="w-full px-4 py-2 border rounded text-sm mb-4"
    />
  )
}
