import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import type { BenchmarkResult } from '../../../../shared/types'
import './components/large-list'
import './components/deep-tree'
import './components/rapid-counter'
import './components/results-table'

const LIT_ICON = `<svg viewBox="0 0 160 200" width="28" height="28"><path d="M40 120l40-120 40 80-40 40-20-20z" fill="#00E8FF"/><path d="M40 120l20 20 40-40v80l-60-40z" fill="#283198"/><path d="M100 180v-80l40-40v80z" fill="#324FFF"/><path d="M40 120l60 60v-80l-40 40z" fill="#0FF"/></svg>`

@customElement('perf-app')
class PerfApp extends LitElement {
  @state() results: BenchmarkResult[] = []
  @state() activeView: 'list' | 'deep-tree' | 'rapid-counter' = 'list'

  private addResult(e: CustomEvent<BenchmarkResult>) {
    this.results = [...this.results, e.detail]
  }

  render() {
    return html`
      <div class="min-h-screen bg-gray-50 p-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center gap-3 mb-2">
            <span .innerHTML=${LIT_ICON}></span>
            <h1 class="text-3xl font-bold text-gray-900">
              Performance Stress Test — Lit
            </h1>
            <a href="http://localhost:1355" class="ml-auto text-sm text-gray-400 hover:text-gray-600">← Dashboard</a>
          </div>
          <p class="text-gray-500 mb-6">Lit 3 • Vite • TypeScript</p>

          <div class="flex gap-2 mb-6">
            <button
              @click=${() => { this.activeView = 'list' }}
              class=${`px-4 py-2 rounded text-sm font-medium ${this.activeView === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              List Operations
            </button>
            <button
              @click=${() => { this.activeView = 'deep-tree' }}
              class=${`px-4 py-2 rounded text-sm font-medium ${this.activeView === 'deep-tree' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              Deep Tree
            </button>
            <button
              @click=${() => { this.activeView = 'rapid-counter' }}
              class=${`px-4 py-2 rounded text-sm font-medium ${this.activeView === 'rapid-counter' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
              Rapid Counter
            </button>
          </div>

          ${this.activeView === 'list' ? html`<large-list @result=${this.addResult}></large-list>` : ''}
          ${this.activeView === 'deep-tree' ? html`<deep-tree @result=${this.addResult}></deep-tree>` : ''}
          ${this.activeView === 'rapid-counter' ? html`<rapid-counter @result=${this.addResult}></rapid-counter>` : ''}

          <results-table .results=${this.results} @clear=${() => { this.results = [] }}></results-table>
        </div>
      </div>
    `
  }

  createRenderRoot() { return this }
}
