<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTaskStore } from '../stores/task-store'

const store = useTaskStore()
const query = ref(store.filters.search || '')

let timeout: ReturnType<typeof setTimeout>
watch(query, (val) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => store.setFilter('search', val), 300)
})
</script>

<template>
  <input
    v-model="query"
    type="text"
    placeholder="Search tasks..."
    class="w-full px-4 py-2 border rounded text-sm mb-4"
  />
</template>
