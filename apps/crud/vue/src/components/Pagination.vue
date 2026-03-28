<script setup lang="ts">
import { computed } from 'vue'
import { useTaskStore } from '../stores/task-store'

const props = defineProps<{ totalCount: number }>()
const store = useTaskStore()

const page = computed(() => store.filters.page || 1)
const perPage = computed(() => store.filters.perPage || 10)
const totalPages = computed(() => Math.ceil(props.totalCount / perPage.value))
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
    <p class="text-sm text-gray-500">Page {{ page }} of {{ totalPages }} ({{ totalCount }} tasks)</p>
    <div class="flex gap-2">
      <button @click="store.setFilter('page', page - 1)" :disabled="page <= 1"
        class="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50">Previous</button>
      <button @click="store.setFilter('page', page + 1)" :disabled="page >= totalPages"
        class="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
    </div>
  </div>
</template>
