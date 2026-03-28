<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { fetchTask, updateTask, fetchCategories } from '$lib/api/tasks'
  import TaskForm from '$lib/components/TaskForm.svelte'
  import type { Task, Category } from '../../../../../../../shared/types'
  import type { TaskFormData } from '$lib/schemas/task'

  let task = $state<Task | null>(null)
  let categories = $state<Category[]>([])
  let submitting = $state(false)
  let loading = $state(true)

  onMount(async () => {
    const id = Number($page.params.id)
    const [t, c] = await Promise.all([fetchTask(id), fetchCategories()])
    task = t
    categories = c
    loading = false
  })

  async function handleSubmit(data: TaskFormData) {
    submitting = true
    await updateTask(Number($page.params.id), data)
    goto('/tasks')
  }
</script>

<h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
{#if loading}
  <p class="text-gray-500">Loading...</p>
{:else if !task}
  <p class="text-gray-500">Task not found</p>
{:else}
  <TaskForm {categories} defaultValues={task} onsubmit={handleSubmit} isSubmitting={submitting} />
{/if}
