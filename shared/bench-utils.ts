import type { BenchmarkResult } from './types'

declare global {
  interface Window {
    __BENCH_RESULTS__: BenchmarkResult[]
    __runBenchmark: (name: string) => Promise<BenchmarkResult>
  }
  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }
}

export function getMemoryKB(): number | undefined {
  return performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024) : undefined
}

export function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

export async function runTimed(
  name: string,
  framework: BenchmarkResult['framework'],
  app: BenchmarkResult['app'],
  fn: () => void | Promise<void>,
): Promise<BenchmarkResult> {
  const memBefore = getMemoryKB()
  const start = performance.now()

  await fn()
  await waitForPaint()

  const end = performance.now()
  const memAfter = getMemoryKB()

  const result: BenchmarkResult = {
    name,
    framework,
    app,
    metrics: {
      duration_ms: Math.round((end - start) * 100) / 100,
      memory_before_kb: memBefore,
      memory_after_kb: memAfter,
    },
    runs: 1,
    timestamp: new Date().toISOString(),
  }

  if (!window.__BENCH_RESULTS__) {
    window.__BENCH_RESULTS__ = []
  }
  window.__BENCH_RESULTS__.push(result)

  return result
}

// Random data generators for perf stress tests
const adjectives = [
  'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain',
  'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy',
  'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive',
]

const nouns = [
  'table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich',
  'burger', 'pizza', 'mouse', 'keyboard', 'garden', 'forest', 'river', 'mountain',
  'castle', 'dragon', 'wizard', 'knight', 'queen', 'king', 'prince', 'princess',
]

let nextId = 1

export function resetId(): void {
  nextId = 1
}

export function buildData(count: number): { id: number; label: string; selected: boolean }[] {
  const data = []
  for (let i = 0; i < count; i++) {
    data.push({
      id: nextId++,
      label: `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`,
      selected: false,
    })
  }
  return data
}
