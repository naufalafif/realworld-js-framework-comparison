export interface BenchmarkMetrics {
  duration_ms: number
  memory_before_kb?: number
  memory_after_kb?: number
  fps?: number
}

export interface BenchmarkRun {
  name: string
  framework: 'react' | 'vue' | 'svelte'
  app: string
  metrics: BenchmarkMetrics
  timestamp: string
}

export interface AggregatedResult {
  name: string
  framework: 'react' | 'vue' | 'svelte'
  app: string
  stats: {
    mean: number
    median: number
    p95: number
    stddev: number
    min: number
    max: number
  }
  memoryDelta?: {
    mean: number
    median: number
  }
  fps?: {
    mean: number
    median: number
  }
  runs: number
}

export interface BuildMetrics {
  framework: 'react' | 'vue' | 'svelte'
  app: string
  jsSize: number
  jsSizeGzip: number
  cssSize: number
  cssSizeGzip: number
  totalSize: number
  totalSizeGzip: number
  buildTimeMs: number
}
