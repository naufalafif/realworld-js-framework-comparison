import { useState, useEffect, useRef } from 'preact/hooks'
import { runTimed } from '../../../../../shared/bench-utils'
import type { BenchmarkResult } from '../../../../../shared/types'

interface Props {
  onResult: (result: BenchmarkResult) => void
}

function DeepNode({ depth, value, onLeafRender }: { depth: number; value: number; onLeafRender: () => void }) {
  if (depth <= 0) {
    useEffect(() => {
      onLeafRender()
    })
    return <span class="text-xs text-gray-500">Leaf: {value}</span>
  }

  return (
    <div style={{ paddingLeft: 1 }}>
      <DeepNode depth={depth - 1} value={value} onLeafRender={onLeafRender} />
    </div>
  )
}

export default function DeepTree({ onResult }: Props) {
  const [value, setValue] = useState(0)
  const [depth, setDepth] = useState(500)
  const [mounted, setMounted] = useState(false)
  const [running, setRunning] = useState(false)
  const resolveRef = useRef<(() => void) | null>(null)

  const handleLeafRender = () => {
    if (resolveRef.current) {
      resolveRef.current()
      resolveRef.current = null
    }
  }

  const mountTree = async () => {
    setRunning(true)
    const result = await runTimed('deep-tree-mount', 'preact', 'perf-stress', () => {
      setMounted(true)
    })
    onResult(result)
    setRunning(false)
  }

  const updateTree = async () => {
    setRunning(true)
    const start = performance.now()
    const waitForLeaf = new Promise<void>((resolve) => {
      resolveRef.current = resolve
    })
    setValue((v) => v + 1)
    await waitForLeaf
    const duration = performance.now() - start

    const result: BenchmarkResult = {
      name: 'deep-tree-update',
      framework: 'preact',
      app: 'perf-stress',
      metrics: { duration_ms: Math.round(duration * 100) / 100 },
      runs: 1,
      timestamp: new Date().toISOString(),
    }

    if (!window.__BENCH_RESULTS__) window.__BENCH_RESULTS__ = []
    window.__BENCH_RESULTS__.push(result)
    onResult(result)
    setRunning(false)
  }

  const unmountTree = async () => {
    setRunning(true)
    const result = await runTimed('deep-tree-unmount', 'preact', 'perf-stress', () => {
      setMounted(false)
    })
    onResult(result)
    setRunning(false)
  }

  return (
    <div>
      <div class="flex flex-wrap gap-2 mb-4">
        <label class="flex items-center gap-2 text-sm text-gray-700">
          Depth:
          <input
            type="number"
            value={depth}
            onInput={(e) => setDepth(Number((e.target as HTMLInputElement).value))}
            min={10}
            max={1000}
            class="w-24 px-2 py-1 border rounded"
          />
        </label>
        <button onClick={mountTree} disabled={running || mounted}
          class="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50">
          Mount tree ({depth} levels)
        </button>
        <button onClick={updateTree} disabled={running || !mounted}
          class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">
          Update tree (propagate)
        </button>
        <button onClick={unmountTree} disabled={running || !mounted}
          class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
          Unmount tree
        </button>
      </div>

      <p class="text-sm text-gray-500 mb-4">
        {mounted ? `Tree mounted with ${depth} levels, value: ${value}` : 'Tree not mounted'}
      </p>

      <div class="max-h-96 overflow-y-auto border rounded p-2">
        {mounted && <DeepNode depth={depth} value={value} onLeafRender={handleLeafRender} />}
      </div>
    </div>
  )
}
