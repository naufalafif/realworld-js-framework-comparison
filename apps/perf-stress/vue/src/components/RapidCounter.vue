<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import type { BenchmarkResult } from '../../../../../shared/types'

const emit = defineEmits<{
  result: [result: BenchmarkResult]
}>()

const count = ref(0)
const running = ref(false)
const duration = ref(1)
let frameCount = 0
let startTime = 0
let rafId = 0

function startRapid() {
  running.value = true
  count.value = 0
  frameCount = 0
  startTime = performance.now()
  const durationMs = duration.value * 1000

  function loop() {
    const elapsed = performance.now() - startTime
    if (elapsed < durationMs) {
      frameCount++
      count.value++
      rafId = requestAnimationFrame(loop)
    } else {
      const actualDuration = performance.now() - startTime
      const fps = Math.round((frameCount / actualDuration) * 1000)

      const result: BenchmarkResult = {
        name: `rapid-counter-${duration.value}s`,
        framework: 'vue',
        app: 'perf-stress',
        metrics: {
          duration_ms: Math.round(actualDuration * 100) / 100,
          fps,
        },
        runs: frameCount,
        timestamp: new Date().toISOString(),
      }

      if (!window.__BENCH_RESULTS__) window.__BENCH_RESULTS__ = []
      window.__BENCH_RESULTS__.push(result)
      emit('result', result)
      running.value = false
    }
  }

  rafId = requestAnimationFrame(loop)
}

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2 mb-4 items-center">
      <label class="flex items-center gap-2 text-sm text-gray-700">
        Duration (seconds):
        <input type="number" v-model.number="duration" min="1" max="10" class="w-20 px-2 py-1 border rounded" />
      </label>
      <button @click="startRapid" :disabled="running"
        class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
        {{ running ? 'Running...' : `Start rapid updates (${duration}s)` }}
      </button>
    </div>

    <div class="text-center p-8 border rounded bg-white">
      <div class="text-6xl font-bold font-mono text-blue-600">{{ count.toLocaleString() }}</div>
      <p class="text-sm text-gray-500 mt-2">{{ running ? 'Counting...' : 'Updates rendered' }}</p>
    </div>
  </div>
</template>
