import { createSignal, For } from 'solid-js'
import { runTimed, buildData, resetId } from '../../../../../shared/bench-utils'
import type { BenchmarkResult } from '../../../../../shared/types'

interface Row {
  id: number
  label: string
  selected: boolean
}

interface Props {
  onResult: (result: BenchmarkResult) => void
}

export default function LargeList(props: Props) {
  const [rows, setRows] = createSignal<Row[]>([])
  const [running, setRunning] = createSignal(false)

  const run = async (name: string, fn: () => void) => {
    setRunning(true)
    const result = await runTimed(name, 'solid', 'perf-stress', fn)
    props.onResult(result)
    setRunning(false)
  }

  const create10k = () => run('create-10k-rows', () => {
    resetId()
    setRows(buildData(10000))
  })

  const updateEvery10th = () => run('update-every-10th', () => {
    setRows((prev) =>
      prev.map((row, i) =>
        i % 10 === 0 ? { ...row, label: row.label + ' !!!' } : row,
      ),
    )
  })

  const swapRows = () => run('swap-rows', () => {
    setRows((prev) => {
      if (prev.length < 999) return prev
      const next = [...prev]
      const temp = next[1]
      next[1] = next[998]
      next[998] = temp
      return next
    })
  })

  const selectRow = () => run('select-row', () => {
    const currentRows = rows()
    const targetId = currentRows.length > 0 ? currentRows[Math.floor(currentRows.length / 2)].id : -1
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        selected: row.id === targetId,
      })),
    )
  })

  const append1k = () => run('append-1k-rows', () => {
    setRows((prev) => [...prev, ...buildData(1000)])
  })

  const clearAll = () => run('clear-all-rows', () => {
    setRows([])
  })

  return (
    <div>
      <div class="flex flex-wrap gap-2 mb-4">
        <button onClick={create10k} disabled={running()}
          class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
          Create 10,000 rows
        </button>
        <button onClick={updateEvery10th} disabled={running() || rows().length === 0}
          class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">
          Update every 10th row
        </button>
        <button onClick={swapRows} disabled={running() || rows().length < 999}
          class="px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50">
          Swap rows
        </button>
        <button onClick={selectRow} disabled={running() || rows().length === 0}
          class="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50">
          Select row
        </button>
        <button onClick={append1k} disabled={running()}
          class="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50">
          Append 1,000 rows
        </button>
        <button onClick={clearAll} disabled={running() || rows().length === 0}
          class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
          Clear all
        </button>
      </div>

      <p class="text-sm text-gray-500 mb-4">Rows: {rows().length.toLocaleString()}</p>

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
            <For each={rows()}>
              {(row) => (
                <tr class={row.selected ? 'bg-blue-100' : 'hover:bg-gray-50'}>
                  <td class="p-2 text-gray-500">{row.id}</td>
                  <td class="p-2">{row.label}</td>
                  <td class="p-2">
                    <button
                      onClick={() =>
                        setRows((prev) => prev.filter((r) => r.id !== row.id))
                      }
                      class="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  )
}
