<script setup lang="ts">
import { ref } from 'vue'
import { runTimed } from '../../../../../shared/bench-utils'
import type { BenchmarkResult } from '../../../../../shared/types'
import DeepNode from './DeepNode.vue'

const emit = defineEmits<{
  result: [result: BenchmarkResult]
}>()

const value = ref(0)
const depth = ref(500)
const mounted = ref(false)
const running = ref(false)
let resolveLeaf: (() => void) | null = null

function handleLeafRender() {
  if (resolveLeaf) {
    resolveLeaf()
    resolveLeaf = null
  }
}

async function mountTree() {
  running.value = true
  const result = await runTimed('deep-tree-mount', 'vue', 'perf-stress', () => {
    mounted.value = true
  })
  emit('result', result)
  running.value = false
}

async function updateTree() {
  running.value = true
  const start = performance.now()
  const waitForLeaf = new Promise<void>((resolve) => {
    resolveLeaf = resolve
  })
  value.value++
  await waitForLeaf
  const duration = performance.now() - start

  const result: BenchmarkResult = {
    name: 'deep-tree-update',
    framework: 'vue',
    app: 'perf-stress',
    metrics: { duration_ms: Math.round(duration * 100) / 100 },
    runs: 1,
    timestamp: new Date().toISOString(),
  }

  if (!window.__BENCH_RESULTS__) window.__BENCH_RESULTS__ = []
  window.__BENCH_RESULTS__.push(result)
  emit('result', result)
  running.value = false
}

async function unmountTree() {
  running.value = true
  const result = await runTimed('deep-tree-unmount', 'vue', 'perf-stress', () => {
    mounted.value = false
  })
  emit('result', result)
  running.value = false
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2 mb-4">
      <label class="flex items-center gap-2 text-sm text-gray-700">
        Depth:
        <input type="number" v-model.number="depth" min="10" max="1000" class="w-24 px-2 py-1 border rounded" />
      </label>
      <button @click="mountTree" :disabled="running || mounted"
        class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
        Mount tree ({{ depth }} levels)
      </button>
      <button @click="updateTree" :disabled="running || !mounted"
        class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">
        Update tree (propagate)
      </button>
      <button @click="unmountTree" :disabled="running || !mounted"
        class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
        Unmount tree
      </button>
    </div>

    <p class="text-sm text-gray-500 mb-4">
      {{ mounted ? `Tree mounted with ${depth} levels, value: ${value}` : 'Tree not mounted' }}
    </p>

    <div class="max-h-96 overflow-y-auto border rounded p-2">
      <DeepNode v-if="mounted" :depth="depth" :value="value" @leaf-render="handleLeafRender" />
    </div>
  </div>
</template>
