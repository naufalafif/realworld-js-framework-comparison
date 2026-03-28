<script lang="ts">
  import { onMount } from 'svelte'
  import { filters, setFilter } from '$lib/stores/task-store'
  import { fetchTasks, fetchCategories, deleteTask } from '$lib/api/tasks'
  import TaskList from '$lib/components/TaskList.svelte'
  import TaskFiltersComponent from '$lib/components/TaskFilters.svelte'
  import SearchBar from '$lib/components/SearchBar.svelte'
  import Pagination from '$lib/components/Pagination.svelte'
  import type { Task, Category } from '../../../../../shared/types'

  let tasks = $state<Task[]>([])
  let categories = $state<Category[]>([])
  let totalCount = $state(0)
  let loading = $state(true)

  async function loadTasks() {
    loading = true
    const f = $filters
    const result = await fetchTasks({
      _page: f.page,
      _per_page: f.perPage,
      _sort: f.sortBy,
      _order: f.sortOrder,
      status: f.status,
      categoryId: f.categoryId,
      q: f.search,
    })
    tasks = result.data
    totalCount = result.totalCount
    loading = false
  }

  onMount(async () => {
    categories = await fetchCategories()
  })

  // Reload when filters change
  $effect(() => {
    // Access $filters to subscribe
    $filters
    loadTasks()
  })

  async function handleDelete(id: number) {
    await deleteTask(id)
    loadTasks()
  }
</script>

<h1 class="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
<SearchBar />
<TaskFiltersComponent {categories} />
{#if loading}
  <p class="text-center text-gray-500 py-8">Loading...</p>
{:else}
  <TaskList {tasks} {categories} ondelete={handleDelete} />
  <Pagination {totalCount} />
{/if}
