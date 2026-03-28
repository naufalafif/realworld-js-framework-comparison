<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { createTask, fetchCategories } from '../api/tasks'
import TaskForm from '../components/TaskForm.vue'
import type { TaskFormData } from '../schemas/task'

const router = useRouter()
const queryClient = useQueryClient()

const { data: categories = { value: [] } } = useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
})

const mutation = useMutation({
  mutationFn: (data: TaskFormData) => createTask(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    router.push('/tasks')
  },
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Create Task</h1>
    <TaskForm :categories="categories || []" @submit="(data: TaskFormData) => mutation.mutate(data)" :is-submitting="mutation.isPending.value" />
  </div>
</template>
