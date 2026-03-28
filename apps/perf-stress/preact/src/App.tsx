import { useState } from 'preact/hooks'
import ResultsTable from './components/ResultsTable'
import LargeList from './components/LargeList'
import DeepTree from './components/DeepTree'
import RapidCounter from './components/RapidCounter'
import type { BenchmarkResult } from '../../../../shared/types'

const PREACT_ICON = `<svg viewBox="0 0 256 296" width="28" height="28"><path d="M128 0L256 73.9V222.1L128 296L0 222.1V73.9L128 0z" fill="#673AB8"/><path d="M34.865 220.478c17.016 21.78 71.095 5.185 122.15-34.704s81.988-88.196 64.972-109.975c-17.016-21.78-71.095-5.185-122.15 34.704S17.849 198.699 34.865 220.478z" stroke="#fff" stroke-width="16" fill="none"/><path d="M220.875 220.478c-17.016 21.78-71.095 5.185-122.15-34.704S16.737 97.578 33.753 75.799c17.016-21.78 71.095-5.185 122.15 34.704s81.988 88.196 64.972 109.975z" stroke="#fff" stroke-width="16" fill="none"/><circle cx="128" cy="148" r="17" fill="#fff"/></svg>`

export default function App() {
  const [results, setResults] = useState<BenchmarkResult[]>([])
  const [activeView, setActiveView] = useState<'list' | 'deep-tree' | 'rapid-counter'>('list')

  const addResult = (result: BenchmarkResult) => {
    setResults((prev) => [...prev, result])
  }

  return (
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-3 mb-2">
          <span dangerouslySetInnerHTML={{ __html: PREACT_ICON }} />
          <h1 class="text-3xl font-bold text-gray-900">
            Performance Stress Test — Preact
          </h1>
          <a href="http://localhost:1355" class="ml-auto text-sm text-gray-400 hover:text-gray-600">← Dashboard</a>
        </div>
        <p class="text-gray-500 mb-6">Preact 10 • Vite • TypeScript</p>

        <div class="flex gap-2 mb-6">
          <button
            onClick={() => setActiveView('list')}
            class={`px-4 py-2 rounded text-sm font-medium ${activeView === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            List Operations
          </button>
          <button
            onClick={() => setActiveView('deep-tree')}
            class={`px-4 py-2 rounded text-sm font-medium ${activeView === 'deep-tree' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Deep Tree
          </button>
          <button
            onClick={() => setActiveView('rapid-counter')}
            class={`px-4 py-2 rounded text-sm font-medium ${activeView === 'rapid-counter' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Rapid Counter
          </button>
        </div>

        {activeView === 'list' && <LargeList onResult={addResult} />}
        {activeView === 'deep-tree' && <DeepTree onResult={addResult} />}
        {activeView === 'rapid-counter' && <RapidCounter onResult={addResult} />}

        <ResultsTable results={results} onClear={() => setResults([])} />
      </div>
    </div>
  )
}
