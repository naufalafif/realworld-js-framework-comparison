<script lang="ts">
  import { runTimed } from '../../../../../shared/bench-utils'
  import type { BenchmarkResult } from '../../../../../shared/types'
  import DeepNode from './DeepNode.svelte'

  let { onresult }: { onresult: (result: BenchmarkResult) => void } = $props()

  let value = $state(0)
  let depth = $state(500)
  let mounted = $state(false)
  let running = $state(false)
  let resolveLeaf: (() => void) | null = null

  function handleLeafRender() {
    if (resolveLeaf) {
      resolveLeaf()
      resolveLeaf = null
    }
  }

  async function mountTree() {
    running = true
    const result = await runTimed('deep-tree-mount', 'svelte', 'perf-stress', () => {
      mounted = true
    })
    onresult(result)
    running = false
  }

  async function updateTree() {
    running = true
    const start = performance.now()
    const waitForLeaf = new Promise<void>((resolve) => {
      resolveLeaf = resolve
    })
    value++
    await waitForLeaf
    const duration = performance.now() - start

    const result: BenchmarkResult = {
      name: 'deep-tree-update',
      framework: 'svelte',
      app: 'perf-stress',
      metrics: { duration_ms: Math.round(duration * 100) / 100 },
      runs: 1,
      timestamp: new Date().toISOString(),
    }

    if (!window.__BENCH_RESULTS__) window.__BENCH_RESULTS__ = []
    window.__BENCH_RESULTS__.push(result)
    onresult(result)
    running = false
  }

  async function unmountTree() {
    running = true
    const result = await runTimed('deep-tree-unmount', 'svelte', 'perf-stress', () => {
      mounted = false
    })
    onresult(result)
    running = false
  }
</script>

<div>
  <div class="flex flex-wrap gap-2 mb-4">
    <label class="flex items-center gap-2 text-sm text-gray-700">
      Depth:
      <input type="number" bind:value={depth} min={10} max={1000} class="w-24 px-2 py-1 border rounded" />
    </label>
    <button onclick={mountTree} disabled={running || mounted}
      class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
      Mount tree ({depth} levels)
    </button>
    <button onclick={updateTree} disabled={running || !mounted}
      class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">
      Update tree (propagate)
    </button>
    <button onclick={unmountTree} disabled={running || !mounted}
      class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
      Unmount tree
    </button>
  </div>

  <p class="text-sm text-gray-500 mb-4">
    {mounted ? `Tree mounted with ${depth} levels, value: ${value}` : 'Tree not mounted'}
  </p>

  <div class="max-h-96 overflow-y-auto border rounded p-2">
    {#if mounted}
      <DeepNode {depth} {value} onleafrender={handleLeafRender} />
    {/if}
  </div>
</div>
