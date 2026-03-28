import type { BenchmarkResult } from '../../../../../shared/types'

interface Props {
  results: BenchmarkResult[]
  onClear: () => void
}

export default function ResultsTable({ results, onClear }: Props) {
  if (results.length === 0) return null

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Results</h2>
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
        >
          Clear Results
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 font-medium text-gray-700">#</th>
              <th className="text-left p-3 font-medium text-gray-700">Benchmark</th>
              <th className="text-right p-3 font-medium text-gray-700">Duration (ms)</th>
              <th className="text-right p-3 font-medium text-gray-700">Memory Δ (KB)</th>
              <th className="text-left p-3 font-medium text-gray-700">Time</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-3 text-gray-500">{i + 1}</td>
                <td className="p-3 font-medium text-gray-900">{r.name}</td>
                <td className="p-3 text-right font-mono text-blue-600">
                  {r.metrics.duration_ms.toFixed(2)}
                </td>
                <td className="p-3 text-right font-mono text-gray-600">
                  {r.metrics.memory_before_kb && r.metrics.memory_after_kb
                    ? (r.metrics.memory_after_kb - r.metrics.memory_before_kb).toLocaleString()
                    : '—'}
                </td>
                <td className="p-3 text-gray-500 text-xs">
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
