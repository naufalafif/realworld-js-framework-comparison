<script setup lang="ts">
import { useTaskStore } from '../stores/task-store'
import type { Category } from '../../../../../shared/types'

defineProps<{ categories: Category[] }>()

const store = useTaskStore()
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center mb-6">
    <select :value="store.filters.status || 'all'" @change="store.setFilter('status', ($event.target as HTMLSelectElement).value as any)"
      class="px-3 py-2 border rounded text-sm bg-white">
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="done">Done</option>
    </select>

    <select :value="store.filters.categoryId || ''" @change="store.setFilter('categoryId', ($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : undefined)"
      class="px-3 py-2 border rounded text-sm bg-white">
      <option value="">All Categories</option>
      <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
    </select>

    <select :value="store.filters.sortBy || 'createdAt'" @change="store.setFilter('sortBy', ($event.target as HTMLSelectElement).value as any)"
      class="px-3 py-2 border rounded text-sm bg-white">
      <option value="createdAt">Date Created</option>
      <option value="title">Title</option>
      <option value="priority">Priority</option>
    </select>

    <button @click="store.setFilter('sortOrder', store.filters.sortOrder === 'asc' ? 'desc' : 'asc')"
      class="px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50">
      {{ store.filters.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc' }}
    </button>

    <button @click="store.resetFilters" class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
      Reset
    </button>
  </div>
</template>
