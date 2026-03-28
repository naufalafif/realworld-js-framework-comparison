import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import type { BenchmarkResult } from '../../../../../shared/types'

@customElement('rapid-counter')
class RapidCounter extends LitElement {
  @state() count = 0
  @state() running = false
  @state() duration = 1

  private frameCount = 0
  private startTime = 0
  private rafId = 0

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this.rafId) cancelAnimationFrame(this.rafId)
  }

  private startRapid() {
    this.running = true
    this.count = 0
    this.frameCount = 0
    this.startTime = performance.now()
    const durationMs = this.duration * 1000

    const loop = () => {
      const elapsed = performance.now() - this.startTime
      if (elapsed < durationMs) {
        this.frameCount++
        this.count++
        this.rafId = requestAnimationFrame(loop)
      } else {
        const totalFrames = this.frameCount
        const actualDuration = performance.now() - this.startTime
        const fps = Math.round((totalFrames / actualDuration) * 1000)

        const result: BenchmarkResult = {
          name: `rapid-counter-${this.duration}s`,
          framework: 'lit',
          app: 'perf-stress',
          metrics: {
            duration_ms: Math.round(actualDuration * 100) / 100,
            fps,
          },
          runs: totalFrames,
          timestamp: new Date().toISOString(),
        }

        if (!window.__BENCH_RESULTS__) window.__BENCH_RESULTS__ = []
        window.__BENCH_RESULTS__.push(result)
        this.dispatchEvent(new CustomEvent<BenchmarkResult>('result', { detail: result }))
        this.running = false
      }
    }

    this.rafId = requestAnimationFrame(loop)
  }

  render() {
    return html`
      <div>
        <div class="flex flex-wrap gap-2 mb-4 items-center">
          <label class="flex items-center gap-2 text-sm text-gray-700">
            Duration (seconds):
            <input
              type="number"
              .value=${String(this.duration)}
              @input=${(e: InputEvent) => { this.duration = Number((e.target as HTMLInputElement).value) }}
              min="1"
              max="10"
              class="w-20 px-2 py-1 border rounded"
            />
          </label>
          <button @click=${this.startRapid} ?disabled=${this.running}
            class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
            ${this.running ? 'Running...' : `Start rapid updates (${this.duration}s)`}
          </button>
        </div>

        <div class="text-center p-8 border rounded bg-white">
          <div class="text-6xl font-bold font-mono text-blue-600">${this.count.toLocaleString()}</div>
          <p class="text-sm text-gray-500 mt-2">
            ${this.running ? 'Counting...' : 'Updates rendered'}
          </p>
        </div>
      </div>
    `
  }

  createRenderRoot() { return this }
}
