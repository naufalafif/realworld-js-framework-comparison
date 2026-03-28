import { useState } from 'react'
import ResultsTable from './components/ResultsTable'
import LargeList from './components/LargeList'
import DeepTree from './components/DeepTree'
import RapidCounter from './components/RapidCounter'
import type { BenchmarkResult } from '../../../../shared/types'

const REACT_ICON = `<svg viewBox="-11.5 -10.232 23 20.463" width="28" height="28"><circle r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" fill="none" stroke-width="1"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`

export default function App() {
  const [results, setResults] = useState<BenchmarkResult[]>([])
  const [activeView, setActiveView] = useState<'list' | 'deep-tree' | 'rapid-counter'>('list')

  const addResult = (result: BenchmarkResult) => {
    setResults((prev) => [...prev, result])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <span dangerouslySetInnerHTML={{ __html: REACT_ICON }} />
          <h1 className="text-3xl font-bold text-gray-900">
            Performance Stress Test — React
          </h1>
        </div>
        <p className="text-gray-500 mb-6">React 19 • Vite • TypeScript</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded text-sm font-medium ${activeView === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            List Operations
          </button>
          <button
            onClick={() => setActiveView('deep-tree')}
            className={`px-4 py-2 rounded text-sm font-medium ${activeView === 'deep-tree' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Deep Tree
          </button>
          <button
            onClick={() => setActiveView('rapid-counter')}
            className={`px-4 py-2 rounded text-sm font-medium ${activeView === 'rapid-counter' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
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
