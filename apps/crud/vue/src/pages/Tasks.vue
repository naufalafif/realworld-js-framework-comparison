<script setup lang="ts">
import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { fetchTasks, fetchCategories, deleteTask } from '../api/tasks'
import { useTaskStore } from '../stores/task-store'
import TaskList from '../components/TaskList.vue'
import TaskFiltersComponent from '../components/TaskFilters.vue'
import SearchBar from '../components/SearchBar.vue'
import Pagination from '../components/Pagination.vue'

const queryClient = useQueryClient()
const store = useTaskStore()

const { data: categories = { value: [] } } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
})

const queryParams = computed(() => ({
  _page: store.filters.page,
  _per_page: store.filters.perPage,
  _sort: store.filters.sortBy,
  _order: store.filters.sortOrder,
  status: store.filters.status,
  categoryId: store.filters.categoryId,
  q: store.filters.search,
}))

const { data, isLoading } = useQuery({
  queryKey: ['tasks', queryParams],
  queryFn: () => fetchTasks(queryParams.value),
})

const deleteMutation = useMutation({
  mutationFn: deleteTask,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
    <SearchBar />
    <TaskFiltersComponent :categories="categories || []" />
    <p v-if="isLoading" class="text-center text-gray-500 py-8">Loading...</p>
    <template v-else>
      <TaskList :tasks="data?.data || []" :categories="categories || []" @delete="(id: number) => deleteMutation.mutate(id)" />
      <Pagination :total-count="data?.totalCount || 0" />
    </template>
  </div>
</template>
