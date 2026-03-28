import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { runTimed } from '../../../../../shared/bench-utils'
import type { BenchmarkResult } from '../../../../../shared/types'

@customElement('deep-tree')
class DeepTree extends LitElement {
  @state() value = 0
  @state() depth = 500
  @state() mounted = false
  @state() running = false

  private resolveLeaf: (() => void) | null = null

  private renderTree(depth: number, value: number): string {
    if (depth <= 0) {
      return `<span class="text-xs text-gray-500">Leaf: ${value}</span>`
    }
    return `<div style="padding-left:1px">${this.renderTree(depth - 1, value)}</div>`
  }

  private async mountTree() {
    this.running = true
    const result = await runTimed('deep-tree-mount', 'lit', 'perf-stress', () => {
      this.mounted = true
    })
    this.dispatchEvent(new CustomEvent<BenchmarkResult>('result', { detail: result }))
    this.running = false
  }

  private async updateTree() {
    this.running = true
    const start = performance.now()
    this.value = this.value + 1
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve())
      })
    })
    const duration = performance.now() - start

    const result: BenchmarkResult = {
      name: 'deep-tree-update',
      framework: 'lit',
      app: 'perf-stress',
      metrics: { duration_ms: Math.round(duration * 100) / 100 },
      runs: 1,
      timestamp: new Date().toISOString(),
    }

    if (!window.__BENCH_RESULTS__) window.__BENCH_RESULTS__ = []
    window.__BENCH_RESULTS__.push(result)
    this.dispatchEvent(new CustomEvent<BenchmarkResult>('result', { detail: result }))
    this.running = false
  }

  private async unmountTree() {
    this.running = true
    const result = await runTimed('deep-tree-unmount', 'lit', 'perf-stress', () => {
      this.mounted = false
    })
    this.dispatchEvent(new CustomEvent<BenchmarkResult>('result', { detail: result }))
    this.running = false
  }

  render() {
    return html`
      <div>
        <div class="flex flex-wrap gap-2 mb-4">
          <label class="flex items-center gap-2 text-sm text-gray-700">
            Depth:
            <input
              type="number"
              .value=${String(this.depth)}
              @input=${(e: InputEvent) => { this.depth = Number((e.target as HTMLInputElement).value) }}
              min="10"
              max="1000"
              class="w-24 px-2 py-1 border rounded"
            />
          </label>
          <button @click=${this.mountTree} ?disabled=${this.running || this.mounted}
            class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
            Mount tree (${this.depth} levels)
          </button>
          <button @click=${this.updateTree} ?disabled=${this.running || !this.mounted}
            class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">
            Update tree (propagate)
          </button>
          <button @click=${this.unmountTree} ?disabled=${this.running || !this.mounted}
            class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
            Unmount tree
          </button>
        </div>

        <p class="text-sm text-gray-500 mb-4">
          ${this.mounted ? `Tree mounted with ${this.depth} levels, value: ${this.value}` : 'Tree not mounted'}
        </p>

        <div class="max-h-96 overflow-y-auto border rounded p-2">
          ${this.mounted ? html`<div .innerHTML=${this.renderTree(this.depth, this.value)}></div>` : html``}
        </div>
      </div>
    `
  }

  createRenderRoot() { return this }
}
