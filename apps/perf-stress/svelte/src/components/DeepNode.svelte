<script lang="ts">
  import { onMount } from 'svelte'

  let { depth, value, onleafrender }: { depth: number; value: number; onleafrender: () => void } = $props()

  $effect(() => {
    // Track value to trigger on updates
    value
    if (depth <= 0) {
      onleafrender()
    }
  })
</script>

{#if depth <= 0}
  <span class="text-xs text-gray-500">Leaf: {value}</span>
{:else}
  <div style="padding-left: 1px">
    <svelte:self depth={depth - 1} {value} {onleafrender} />
  </div>
{/if}
