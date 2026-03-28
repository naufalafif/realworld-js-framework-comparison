<script lang="ts">
  import { filters, setFilter } from '../stores/task-store'

  let { totalCount }: { totalCount: number } = $props()

  let page = $derived($filters.page || 1)
  let perPage = $derived($filters.perPage || 10)
  let totalPages = $derived(Math.ceil(totalCount / perPage))
</script>

{#if totalPages > 1}
  <div class="flex items-center justify-between mt-6">
    <p class="text-sm text-gray-500">Page {page} of {totalPages} ({totalCount} tasks)</p>
    <div class="flex gap-2">
      <button onclick={() => setFilter('page', page - 1)} disabled={page <= 1}
        class="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50">Previous</button>
      <button onclick={() => setFilter('page', page + 1)} disabled={page >= totalPages}
        class="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
    </div>
  </div>
{/if}
