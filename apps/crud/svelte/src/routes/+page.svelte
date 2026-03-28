<script lang="ts">
  import { onMount } from 'svelte'
  import { fetchTasks } from '$lib/api/tasks'
  import type { Task } from '../../../../shared/types'

  let tasks = $state<Task[]>([])

  onMount(async () => {
    const result = await fetchTasks({ perPage: 1000 })
    tasks = result.data
  })

  let pending = $derived(tasks.filter((t) => t.status === 'pending').length)
  let inProgress = $derived(tasks.filter((t) => t.status === 'in-progress').length)
  let done = $derived(tasks.filter((t) => t.status === 'done').length)
</script>

<h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
<div class="grid grid-cols-3 gap-4 mb-8">
  <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
    <div class="text-2xl font-bold text-orange-600">{pending}</div>
    <div class="text-sm text-orange-700">Pending</div>
  </div>
  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div class="text-2xl font-bold text-blue-600">{inProgress}</div>
    <div class="text-sm text-blue-700">In Progress</div>
  </div>
  <div class="bg-green-50 border border-green-200 rounded-lg p-4">
    <div class="text-2xl font-bold text-green-600">{done}</div>
    <div class="text-sm text-green-700">Done</div>
  </div>
</div>
<a href="/tasks" class="text-blue-600 hover:text-blue-700 text-sm font-medium">View all tasks →</a>
