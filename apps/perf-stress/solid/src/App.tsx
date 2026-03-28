import { createSignal, Show } from 'solid-js'
import ResultsTable from './components/ResultsTable'
import LargeList from './components/LargeList'
import DeepTree from './components/DeepTree'
import RapidCounter from './components/RapidCounter'
import type { BenchmarkResult } from '../../../../shared/types'

const SOLID_ICON = `<svg viewBox="0 0 166 155.3" width="28" height="28"><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" fill="#76b3e1"/><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf0fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" opacity=".3" fill="url(#a)"/><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" fill="#518ac8"/><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" opacity=".3" fill="url(#b)"/></svg>`

export default function App() {
  const [results, setResults] = createSignal<BenchmarkResult[]>([])
  const [activeView, setActiveView] = createSignal<'list' | 'deep-tree' | 'rapid-counter'>('list')

  const addResult = (result: BenchmarkResult) => {
    setResults((prev) => [...prev, result])
  }

  return (
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-3 mb-2">
          <span innerHTML={SOLID_ICON} />
          <h1 class="text-3xl font-bold text-gray-900">
            Performance Stress Test — Solid
          </h1>
        </div>
        <p class="text-gray-500 mb-6">Solid.js 1.9 • Vite • TypeScript</p>

        <div class="flex gap-2 mb-6">
          <button
            onClick={() => setActiveView('list')}
            class={`px-4 py-2 rounded text-sm font-medium ${activeView() === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            List Operations
          </button>
          <button
            onClick={() => setActiveView('deep-tree')}
            class={`px-4 py-2 rounded text-sm font-medium ${activeView() === 'deep-tree' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Deep Tree
          </button>
          <button
            onClick={() => setActiveView('rapid-counter')}
            class={`px-4 py-2 rounded text-sm font-medium ${activeView() === 'rapid-counter' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Rapid Counter
          </button>
        </div>

        <Show when={activeView() === 'list'}>
          <LargeList onResult={addResult} />
        </Show>
        <Show when={activeView() === 'deep-tree'}>
          <DeepTree onResult={addResult} />
        </Show>
        <Show when={activeView() === 'rapid-counter'}>
          <RapidCounter onResult={addResult} />
        </Show>

        <ResultsTable results={results()} onClear={() => setResults([])} />
      </div>
    </div>
  )
}
