import { createResource, createSignal, Show } from 'solid-js'
import { fetchTasks, fetchCategories, deleteTask } from '../api/tasks'
import { filters } from '../store/task-store'
import TaskList from '../components/TaskList'
import TaskFiltersComponent from '../components/TaskFilters'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'

export default function Tasks() {
  const [version, setVersion] = createSignal(0)

  const queryParams = () => {
    version() // track version for refetching
    const f = filters()
    return {
      _page: f.page,
      _per_page: f.perPage,
      _sort: f.sortBy,
      _order: f.sortOrder,
      status: f.status,
      categoryId: f.categoryId,
      q: f.search,
    } as Record<string, string | number | undefined>
  }

  const [categories] = createResource(fetchCategories)
  const [data] = createResource(queryParams, (params) => fetchTasks(params))

  const handleDelete = async (id: number) => {
    await deleteTask(id)
    setVersion((v) => v + 1)
  }

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
      <SearchBar />
      <TaskFiltersComponent categories={categories() || []} />
      <Show
        when={!data.loading}
        fallback={<p class="text-center text-gray-500 py-8">Loading...</p>}
      >
        <TaskList
          tasks={data()?.data || []}
          categories={categories() || []}
          onDelete={handleDelete}
        />
        <Pagination totalCount={data()?.totalCount || 0} />
      </Show>
    </div>
  )
}
