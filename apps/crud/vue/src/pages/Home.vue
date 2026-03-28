<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { fetchTasks, fetchCategories } from '../api/tasks'
import { computed } from 'vue'

const { data: taskData } = useQuery({
  queryKey: ['tasks', 'all'],
  queryFn: () => fetchTasks({ perPage: 1000 }),
})

const tasks = computed(() => taskData.value?.data || [])
const pending = computed(() => tasks.value.filter((t) => t.status === 'pending').length)
const inProgress = computed(() => tasks.value.filter((t) => t.status === 'in-progress').length)
const done = computed(() => tasks.value.filter((t) => t.status === 'done').length)
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div class="text-2xl font-bold text-orange-600">{{ pending }}</div>
        <div class="text-sm text-orange-700">Pending</div>
      </div>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="text-2xl font-bold text-blue-600">{{ inProgress }}</div>
        <div class="text-sm text-blue-700">In Progress</div>
      </div>
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="text-2xl font-bold text-green-600">{{ done }}</div>
        <div class="text-sm text-green-700">Done</div>
      </div>
    </div>
    <RouterLink to="/tasks" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
      View all tasks →
    </RouterLink>
  </div>
</template>
