import { createSignal, onCleanup } from 'solid-js'
import type { BenchmarkResult } from '../../../../../shared/types'

interface Props {
  onResult: (result: BenchmarkResult) => void
}

export default function RapidCounter(props: Props) {
  const [count, setCount] = createSignal(0)
  const [running, setRunning] = createSignal(false)
  const [duration, setDuration] = createSignal(1)
  let frameCount = 0
  let startTime = 0
  let rafId = 0

  const startRapid = () => {
    setRunning(true)
    setCount(0)
    frameCount = 0
    startTime = performance.now()
    const durationMs = duration() * 1000

    const loop = () => {
      const elapsed = performance.now() - startTime
      if (elapsed < durationMs) {
        frameCount++
        setCount((c) => c + 1)
        rafId = requestAnimationFrame(loop)
      } else {
        const totalFrames = frameCount
        const actualDuration = performance.now() - startTime
        const fps = Math.round((totalFrames / actualDuration) * 1000)

        const result: BenchmarkResult = {
          name: `rapid-counter-${duration()}s`,
          framework: 'solid',
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
        props.onResult(result)
        setRunning(false)
      }
    }

    rafId = requestAnimationFrame(loop)
  }

  onCleanup(() => {
    if (rafId) cancelAnimationFrame(rafId)
  })

  return (
    <div>
      <div class="flex flex-wrap gap-2 mb-4 items-center">
        <label class="flex items-center gap-2 text-sm text-gray-700">
          Duration (seconds):
          <input
            type="number"
            value={duration()}
            onInput={(e) => setDuration(Number(e.currentTarget.value))}
            min={1}
            max={10}
            class="w-20 px-2 py-1 border rounded"
          />
        </label>
        <button onClick={startRapid} disabled={running()}
          class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50">
          {running() ? 'Running...' : `Start rapid updates (${duration()}s)`}
        </button>
      </div>

      <div class="text-center p-8 border rounded bg-white">
        <div class="text-6xl font-bold font-mono text-blue-600">{count().toLocaleString()}</div>
        <p class="text-sm text-gray-500 mt-2">
          {running() ? 'Counting...' : 'Updates rendered'}
        </p>
      </div>
    </div>
  )
}
