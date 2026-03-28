import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchTasks, fetchCategories, deleteTask } from '../api/tasks'
import { useTaskStore } from '../store/task-store'
import TaskList from '../components/TaskList'
import TaskFiltersComponent from '../components/TaskFilters'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'

export default function Tasks() {
  const queryClient = useQueryClient()
  const { filters } = useTaskStore()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const queryParams: Record<string, string | number | undefined> = {
    _page: filters.page,
    _per_page: filters.perPage,
    _sort: filters.sortBy,
    _order: filters.sortOrder,
    status: filters.status,
    categoryId: filters.categoryId,
    q: filters.search,
  }

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', queryParams],
    queryFn: () => fetchTasks(queryParams),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
      <SearchBar />
      <TaskFiltersComponent categories={categories} />
      {isLoading ? (
        <p className="text-center text-gray-500 py-8">Loading...</p>
      ) : (
        <>
          <TaskList
            tasks={data?.data || []}
            categories={categories}
            onDelete={(id) => deleteMutation.mutate(id)}
          />
          <Pagination totalCount={data?.totalCount || 0} />
        </>
      )}
    </div>
  )
}
