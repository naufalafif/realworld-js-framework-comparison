<script lang="ts">
  import { runTimed, buildData, resetId } from '../../../../../shared/bench-utils'
  import type { BenchmarkResult } from '../../../../../shared/types'

  interface Row {
    id: number
    label: string
    selected: boolean
  }

  let { onresult }: { onresult: (result: BenchmarkResult) => void } = $props()

  let rows = $state<Row[]>([])
  let running = $state(false)

  async function run(name: string, fn: () => void) {
    running = true
    const result = await runTimed(name, 'svelte', 'perf-stress', fn)
    onresult(result)
    running = false
  }

  function create10k() {
    run('create-10k-rows', () => {
      resetId()
      rows = buildData(10000)
    })
  }

  function updateEvery10th() {
    run('update-every-10th', () => {
      for (let i = 0; i < rows.length; i += 10) {
        rows[i].label += ' !!!'
      }
    })
  }

  function swapRows() {
    run('swap-rows', () => {
      if (rows.length < 999) return
      const temp = rows[1]
      rows[1] = rows[998]
      rows[998] = temp
    })
  }

  function selectRow() {
    run('select-row', () => {
      const targetId = rows.length > 0 ? rows[Math.floor(rows.length / 2)].id : -1
      for (const row of rows) {
        row.selected = row.id === targetId
      }
    })
  }

  function append1k() {
    run('append-1k-rows', () => {
      rows.push(...buildData(1000))
    })
  }

  function clearAll() {
    run('clear-all-rows', () => {
      rows = []
    })
  }

  function removeRow(id: number) {
    const idx = rows.findIndex((r) => r.id === id)
    if (idx !== -1) rows.splice(idx, 1)
  }
</script>

<div>
  <div class="flex flex-wrap gap-2 mb-4">
    <button onclick={create10k} disabled={running}
      class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
      Create 10,000 rows
    </button>
    <button onclick={updateEvery10th} disabled={running || rows.length === 0}
      class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">
      Update every 10th row
    </button>
    <button onclick={swapRows} disabled={running || rows.length < 999}
      class="px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50">
      Swap rows
    </button>
    <button onclick={selectRow} disabled={running || rows.length === 0}
      class="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50">
      Select row
    </button>
    <button onclick={append1k} disabled={running}
      class="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50">
      Append 1,000 rows
    </button>
    <button onclick={clearAll} disabled={running || rows.length === 0}
      class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
      Clear all
    </button>
  </div>

  <p class="text-sm text-gray-500 mb-4">Rows: {rows.length.toLocaleString()}</p>

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
        {#each rows as row (row.id)}
          <tr class={row.selected ? 'bg-blue-100' : 'hover:bg-gray-50'}>
            <td class="p-2 text-gray-500">{row.id}</td>
            <td class="p-2">{row.label}</td>
            <td class="p-2">
              <button onclick={() => removeRow(row.id)} class="text-red-500 hover:text-red-700 text-xs">
                Remove
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
