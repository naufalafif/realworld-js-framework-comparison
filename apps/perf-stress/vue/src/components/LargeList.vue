<script setup lang="ts">
import { ref } from 'vue'
import { runTimed, buildData, resetId } from '../../../../../shared/bench-utils'
import type { BenchmarkResult } from '../../../../../shared/types'

interface Row {
  id: number
  label: string
  selected: boolean
}

const emit = defineEmits<{
  result: [result: BenchmarkResult]
}>()

const rows = ref<Row[]>([])
const running = ref(false)

async function run(name: string, fn: () => void) {
  running.value = true
  const result = await runTimed(name, 'vue', 'perf-stress', fn)
  emit('result', result)
  running.value = false
}

function create10k() {
  run('create-10k-rows', () => {
    resetId()
    rows.value = buildData(10000)
  })
}

function updateEvery10th() {
  run('update-every-10th', () => {
    for (let i = 0; i < rows.value.length; i += 10) {
      rows.value[i].label += ' !!!'
    }
  })
}

function swapRows() {
  run('swap-rows', () => {
    if (rows.value.length < 999) return
    const temp = rows.value[1]
    rows.value[1] = rows.value[998]
    rows.value[998] = temp
  })
}

function selectRow() {
  run('select-row', () => {
    const targetId = rows.value.length > 0 ? rows.value[Math.floor(rows.value.length / 2)].id : -1
    for (const row of rows.value) {
      row.selected = row.id === targetId
    }
  })
}

function append1k() {
  run('append-1k-rows', () => {
    rows.value.push(...buildData(1000))
  })
}

function clearAll() {
  run('clear-all-rows', () => {
    rows.value = []
  })
}

function removeRow(id: number) {
  const idx = rows.value.findIndex((r) => r.id === id)
  if (idx !== -1) rows.value.splice(idx, 1)
}
</script>

<template>
  <div>
    <div class="flex flex-wrap gap-2 mb-4">
      <button @click="create10k" :disabled="running"
        class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
        Create 10,000 rows
      </button>
      <button @click="updateEvery10th" :disabled="running || rows.length === 0"
        class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">
        Update every 10th row
      </button>
      <button @click="swapRows" :disabled="running || rows.length < 999"
        class="px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50">
        Swap rows
      </button>
      <button @click="selectRow" :disabled="running || rows.length === 0"
        class="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50">
        Select row
      </button>
      <button @click="append1k" :disabled="running"
        class="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50">
        Append 1,000 rows
      </button>
      <button @click="clearAll" :disabled="running || rows.length === 0"
        class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
        Clear all
      </button>
    </div>

    <p class="text-sm text-gray-500 mb-4">Rows: {{ rows.length.toLocaleString() }}</p>

    <div class="max-h-96 overflow-y-auto border rounded">
      <table class="w-full text-sm">
        <thead class="sticky top-0 bg-gray-100">
          <tr>
            <th class="text-left p-2 w-20">#</th>
            <th class="text-left p-2">Label</th>
            <th class="text-left p-2 w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" :class="row.selected ? 'bg-blue-100' : 'hover:bg-gray-50'">
            <td class="p-2 text-gray-500">{{ row.id }}</td>
            <td class="p-2">{{ row.label }}</td>
            <td class="p-2">
              <button @click="removeRow(row.id)" class="text-red-500 hover:text-red-700 text-xs">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
