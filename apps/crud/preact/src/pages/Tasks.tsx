import { useState, useEffect } from 'preact/hooks'
import { fetchTasks, fetchCategories, deleteTask } from '../api'
import { filters } from '../store/task-store'
import TaskList from '../components/TaskList'
import TaskFiltersComponent from '../components/TaskFilters'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import type { Task, Category } from '../../../../../shared/types'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const f = filters.value

  const loadData = async () => {
    setLoading(true)
    try {
      const queryParams: Record<string, string | number | undefined> = {
        _page: f.page,
        _per_page: f.perPage,
        _sort: f.sortBy,
        _order: f.sortOrder,
        status: f.status,
        categoryId: f.categoryId,
        q: f.search,
      }
      const [taskData, cats] = await Promise.all([
        fetchTasks(queryParams),
        fetchCategories(),
      ])
      setTasks(taskData.data)
      setTotalCount(taskData.totalCount)
      setCategories(cats)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [f.page, f.perPage, f.sortBy, f.sortOrder, f.status, f.categoryId, f.search])

  const handleDelete = async (id: number) => {
    await deleteTask(id)
    loadData()
  }

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
      <SearchBar />
      <TaskFiltersComponent categories={categories} />
      {loading ? (
        <p class="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        <>
          <TaskList
            tasks={tasks}
            categories={categories}
            onDelete={handleDelete}
          />
          <Pagination totalCount={totalCount} />
        </>
      )}
    </div>
  )
}
