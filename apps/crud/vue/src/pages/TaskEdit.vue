<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { fetchTask, updateTask, fetchCategories } from '../api/tasks'
import TaskForm from '../components/TaskForm.vue'
import type { TaskFormData } from '../schemas/task'

const router = useRouter()
const route = useRoute()
const queryClient = useQueryClient()
const id = Number(route.params.id)

const { data: task, isLoading } = useQuery({
  queryKey: ['task', id],
  queryFn: () => fetchTask(id),
})

const { data: categories = { value: [] } } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
})

const mutation = useMutation({
  mutationFn: (data: TaskFormData) => updateTask(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    router.push('/tasks')
  },
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
    <p v-if="isLoading" class="text-gray-500">Loading...</p>
    <p v-else-if="!task" class="text-gray-500">Task not found</p>
    <TaskForm v-else :categories="categories || []" :default-values="task" @submit="(data: TaskFormData) => mutation.mutate(data)" :is-submitting="mutation.isPending.value" />
  </div>
</template>
