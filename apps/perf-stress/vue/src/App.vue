<script setup lang="ts">
import { ref } from 'vue'
import LargeList from './components/LargeList.vue'
import DeepTree from './components/DeepTree.vue'
import RapidCounter from './components/RapidCounter.vue'
import ResultsTable from './components/ResultsTable.vue'
import type { BenchmarkResult } from '../../../../shared/types'

const VUE_ICON = `<svg viewBox="0 0 261.76 226.69" width="28" height="28"><path d="m161.096.001-30.224 52.35L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41B883"/><path d="m161.096.001-30.224 52.35L100.647.001H52.346l78.526 136.01L209.398.001z" fill="#34495E"/></svg>`

const results = ref<BenchmarkResult[]>([])
const activeView = ref<'list' | 'deep-tree' | 'rapid-counter'>('list')

function addResult(result: BenchmarkResult) {
  results.value.push(result)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center gap-3 mb-2">
        <span v-html="VUE_ICON" />
        <h1 class="text-3xl font-bold text-gray-900">
          Performance Stress Test — Vue
        </h1>
      </div>
      <p class="text-gray-500 mb-6">Vue 3.5 • Vite • TypeScript</p>

      <div class="flex gap-2 mb-6">
        <button
          v-for="view in (['list', 'deep-tree', 'rapid-counter'] as const)"
          :key="view"
          @click="activeView = view"
          :class="[
            'px-4 py-2 rounded text-sm font-medium',
            activeView === view ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'
          ]"
        >
          {{ view === 'list' ? 'List Operations' : view === 'deep-tree' ? 'Deep Tree' : 'Rapid Counter' }}
        </button>
      </div>

      <LargeList v-if="activeView === 'list'" @result="addResult" />
      <DeepTree v-if="activeView === 'deep-tree'" @result="addResult" />
      <RapidCounter v-if="activeView === 'rapid-counter'" @result="addResult" />

      <ResultsTable :results="results" @clear="results = []" />
    </div>
  </div>
</template>
