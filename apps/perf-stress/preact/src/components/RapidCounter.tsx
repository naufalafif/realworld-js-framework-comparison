import { useState, useRef, useEffect } from 'preact/hooks'
import type { BenchmarkResult } from '../../../../../shared/types'

interface Props {
  onResult: (result: BenchmarkResult) => void
}

export default function RapidCounter({ onResult }: Props) {
  const [count, setCount] = useState(0)
  const [running, setRunning] = useState(false)
  const [duration, setDuration] = useState(1)
  const frameCountRef = useRef(0)
  const startTimeRef = useRef(0)
  const rafIdRef = useRef(0)
  const displayCountRef = useRef(0)

  useEffect(() => {
    displayCountRef.current = count
  }, [count])

  const startRapid = () => {
    setRunning(true)
    setCount(0)
    frameCountRef.current = 0
    startTimeRef.current = performance.now()
    const durationMs = duration * 1000

    const loop = () => {
      const elapsed = performance.now() - startTimeRef.current
      if (elapsed < durationMs) {
        frameCountRef.current++
        setCount((c) => c + 1)
        rafIdRef.current = requestAnimationFrame(loop)
      } else {
        const totalFrames = frameCountRef.current
        const actualDuration = performance.now() - startTimeRef.current
        const fps = Math.round((totalFrames / actualDuration) * 1000)

        const result: BenchmarkResult = {
          name: `rapid-counter-${duration}s`,
          framework: 'preact',
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
        onResult(result)
        setRunning(false)
      }
    }

    rafIdRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => {
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  return (
    <div>
      <div class="flex flex-wrap gap-2 mb-4 items-center">
        <label class="flex items-center gap-2 text-sm text-gray-700">
          Duration (seconds):
          <input
            type="number"
            value={duration}
            onInput={(e) => setDuration(Number((e.target as HTMLInputElement).value))}
            min={1}
            max={10}
            class="w-20 px-2 py-1 border rounded"
          />
        </label>
        <button onClick={startRapid} disabled={running}
          class="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50">
          {running ? 'Running...' : `Start rapid updates (${duration}s)`}
        </button>
      </div>

      <div class="text-center p-8 border rounded bg-white">
        <div class="text-6xl font-bold font-mono text-purple-600">{count.toLocaleString()}</div>
        <p class="text-sm text-gray-500 mt-2">
          {running ? 'Counting...' : 'Updates rendered'}
        </p>
      </div>
    </div>
  )
}
