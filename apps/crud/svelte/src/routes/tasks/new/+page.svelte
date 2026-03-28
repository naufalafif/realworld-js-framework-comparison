<script lang="ts">
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { createTask, fetchCategories } from '$lib/api/tasks'
  import TaskForm from '$lib/components/TaskForm.svelte'
  import type { Category } from '../../../../../../shared/types'
  import type { TaskFormData } from '$lib/schemas/task'

  let categories = $state<Category[]>([])
  let submitting = $state(false)

  onMount(async () => {
    categories = await fetchCategories()
  })

  async function handleSubmit(data: TaskFormData) {
    submitting = true
    await createTask(data)
    goto('/tasks')
  }
</script>

<h1 class="text-2xl font-bold text-gray-900 mb-6">Create Task</h1>
<TaskForm {categories} onsubmit={handleSubmit} isSubmitting={submitting} />
