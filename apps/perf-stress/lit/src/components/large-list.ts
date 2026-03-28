import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { runTimed, buildData, resetId } from '../../../../../shared/bench-utils'
import type { BenchmarkResult } from '../../../../../shared/types'

interface Row {
  id: number
  label: string
  selected: boolean
}

@customElement('large-list')
class LargeList extends LitElement {
  @state() rows: Row[] = []
  @state() running = false

  private async run(name: string, fn: () => void) {
    this.running = true
    const result = await runTimed(name, 'lit', 'perf-stress', fn)
    this.dispatchEvent(new CustomEvent<BenchmarkResult>('result', { detail: result }))
    this.running = false
  }

  private create10k() {
    this.run('create-10k-rows', () => {
      resetId()
      this.rows = buildData(10000)
    })
  }

  private updateEvery10th() {
    this.run('update-every-10th', () => {
      this.rows = this.rows.map((row, i) =>
        i % 10 === 0 ? { ...row, label: row.label + ' !!!' } : row,
      )
    })
  }

  private swapRows() {
    this.run('swap-rows', () => {
      if (this.rows.length < 999) return
      const next = [...this.rows]
      const temp = next[1]
      next[1] = next[998]
      next[998] = temp
      this.rows = next
    })
  }

  private selectRow() {
    this.run('select-row', () => {
      const targetId = this.rows.length > 0 ? this.rows[Math.floor(this.rows.length / 2)].id : -1
      this.rows = this.rows.map((row) => ({
        ...row,
        selected: row.id === targetId,
      }))
    })
  }

  private append1k() {
    this.run('append-1k-rows', () => {
      this.rows = [...this.rows, ...buildData(1000)]
    })
  }

  private clearAll() {
    this.run('clear-all-rows', () => {
      this.rows = []
    })
  }

  private removeRow(id: number) {
    this.rows = this.rows.filter((r) => r.id !== id)
  }

  render() {
    return html`
      <div>
        <div class="flex flex-wrap gap-2 mb-4">
          <button @click=${this.create10k} ?disabled=${this.running}
            class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
            Create 10,000 rows
          </button>
          <button @click=${this.updateEvery10th} ?disabled=${this.running || this.rows.length === 0}
            class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">
            Update every 10th row
          </button>
          <button @click=${this.swapRows} ?disabled=${this.running || this.rows.length < 999}
            class="px-4 py-2 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 disabled:opacity-50">
            Swap rows
          </button>
          <button @click=${this.selectRow} ?disabled=${this.running || this.rows.length === 0}
            class="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50">
            Select row
          </button>
          <button @click=${this.append1k} ?disabled=${this.running}
            class="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50">
            Append 1,000 rows
          </button>
          <button @click=${this.clearAll} ?disabled=${this.running || this.rows.length === 0}
            class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
            Clear all
          </button>
        </div>

        <p class="text-sm text-gray-500 mb-4">Rows: ${this.rows.length.toLocaleString()}</p>

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
              ${this.rows.map((row) => html`
                <tr class=${row.selected ? 'bg-blue-100' : 'hover:bg-gray-50'}>
                  <td class="p-2 text-gray-500">${row.id}</td>
                  <td class="p-2">${row.label}</td>
                  <td class="p-2">
                    <button
                      @click=${() => this.removeRow(row.id)}
                      class="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      </div>
    `
  }

  createRenderRoot() { return this }
}
