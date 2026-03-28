import { createSignal, createEffect, Show } from 'solid-js'
import { runTimed } from '../../../../../shared/bench-utils'
import type { BenchmarkResult } from '../../../../../shared/types'

interface Props {
  onResult: (result: BenchmarkResult) => void
}

function DeepNode(props: { depth: number; value: number; onLeafRender: () => void }) {
  if (props.depth <= 0) {
    createEffect(() => {
      // Access value to track it reactively
      const _ = props.value
      props.onLeafRender()
    })
    return <span class="text-xs text-gray-500">Leaf: {props.value}</span>
  }

  return (
    <div style={{ "padding-left": "1px" }}>
      <DeepNode depth={props.depth - 1} value={props.value} onLeafRender={props.onLeafRender} />
    </div>
  )
}

export default function DeepTree(props: Props) {
  const [value, setValue] = createSignal(0)
  const [depth, setDepth] = createSignal(500)
  const [mounted, setMounted] = createSignal(false)
  const [running, setRunning] = createSignal(false)
  let resolveRef: (() => void) | null = null

  const handleLeafRender = () => {
    if (resolveRef) {
      resolveRef()
      resolveRef = null
    }
  }

  const mountTree = async () => {
    setRunning(true)
    const result = await runTimed('deep-tree-mount', 'solid', 'perf-stress', () => {
      setMounted(true)
    })
    props.onResult(result)
    setRunning(false)
  }

  const updateTree = async () => {
    setRunning(true)
    const start = performance.now()
    const waitForLeaf = new Promise<void>((resolve) => {
      resolveRef = resolve
    })
    setValue((v) => v + 1)
    await waitForLeaf
    const duration = performance.now() - start

    const result: BenchmarkResult = {
      name: 'deep-tree-update',
      framework: 'solid',
      app: 'perf-stress',
      metrics: { duration_ms: Math.round(duration * 100) / 100 },
      runs: 1,
      timestamp: new Date().toISOString(),
    }

    if (!window.__BENCH_RESULTS__) window.__BENCH_RESULTS__ = []
    window.__BENCH_RESULTS__.push(result)
    props.onResult(result)
    setRunning(false)
  }

  const unmountTree = async () => {
    setRunning(true)
    const result = await runTimed('deep-tree-unmount', 'solid', 'perf-stress', () => {
      setMounted(false)
    })
    props.onResult(result)
    setRunning(false)
  }

  return (
    <div>
      <div class="flex flex-wrap gap-2 mb-4">
        <label class="flex items-center gap-2 text-sm text-gray-700">
          Depth:
          <input
            type="number"
            value={depth()}
            onInput={(e) => setDepth(Number(e.currentTarget.value))}
            min={10}
            max={1000}
            class="w-24 px-2 py-1 border rounded"
          />
        </label>
        <button onClick={mountTree} disabled={running() || mounted()}
          class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
          Mount tree ({depth()} levels)
        </button>
        <button onClick={updateTree} disabled={running() || !mounted()}
          class="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50">
          Update tree (propagate)
        </button>
        <button onClick={unmountTree} disabled={running() || !mounted()}
          class="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50">
          Unmount tree
        </button>
      </div>

      <p class="text-sm text-gray-500 mb-4">
        {mounted() ? `Tree mounted with ${depth()} levels, value: ${value()}` : 'Tree not mounted'}
      </p>

      <div class="max-h-96 overflow-y-auto border rounded p-2">
        <Show when={mounted()}>
          <DeepNode depth={depth()} value={value()} onLeafRender={handleLeafRender} />
        </Show>
      </div>
    </div>
  )
}
