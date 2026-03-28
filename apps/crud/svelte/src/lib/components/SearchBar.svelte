<script lang="ts">
  import { setFilter } from '../stores/task-store'

  let query = $state('')
  let timeout: ReturnType<typeof setTimeout>

  $effect(() => {
    clearTimeout(timeout)
    timeout = setTimeout(() => setFilter('search', query), 300)
  })
</script>

<input
  bind:value={query}
  type="text"
  placeholder="Search tasks..."
  class="w-full px-4 py-2 border rounded text-sm mb-4"
/>
