import type { BenchmarkResult } from '../../../../../shared/types'

interface Props {
  results: BenchmarkResult[]
  onClear: () => void
}

export default function ResultsTable({ results, onClear }: Props) {
  if (results.length === 0) return null

  return (
    <div class="mt-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Results</h2>
        <button
          onClick={onClear}
          class="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
        >
          Clear Results
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="text-left p-3 font-medium text-gray-700">#</th>
              <th class="text-left p-3 font-medium text-gray-700">Benchmark</th>
              <th class="text-right p-3 font-medium text-gray-700">Duration (ms)</th>
              <th class="text-right p-3 font-medium text-gray-700">Memory Δ (KB)</th>
              <th class="text-left p-3 font-medium text-gray-700">Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} class="border-t border-gray-200 hover:bg-gray-50">
                <td class="p-3 text-gray-500">{i + 1}</td>
                <td class="p-3 font-medium text-gray-900">{r.name}</td>
                <td class="p-3 text-right font-mono text-purple-600">
                  {r.metrics.duration_ms.toFixed(2)}
                </td>
                <td class="p-3 text-right font-mono text-gray-600">
                  {r.metrics.memory_before_kb && r.metrics.memory_after_kb
                    && r.metrics.memory_after_kb > r.metrics.memory_before_kb
                    ? (r.metrics.memory_after_kb - r.metrics.memory_before_kb).toLocaleString()
                    : '—'}
                </td>
                <td class="p-3 text-gray-500 text-xs">
                  {new Date(r.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
