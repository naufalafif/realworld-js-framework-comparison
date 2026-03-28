import { execSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { readFileSync } from 'node:fs'
import type { BuildMetrics } from '../utils/types'

function getFileSizes(dir: string): { js: number; css: number; jsGzip: number; cssGzip: number } {
  let js = 0, css = 0, jsGzip = 0, cssGzip = 0

  function walk(d: string) {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const fullPath = join(d, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else {
        const size = statSync(fullPath).size
        const content = readFileSync(fullPath)
        const gzipped = gzipSync(content).length

        if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
          js += size
          jsGzip += gzipped
        } else if (entry.name.endsWith('.css')) {
          css += size
          cssGzip += gzipped
        }
      }
    }
  }

  walk(dir)
  return { js, css, jsGzip, cssGzip }
}

export function collectBuildMetrics(
  appDir: string,
  framework: 'react' | 'vue' | 'svelte',
  app: string,
): BuildMetrics {
  const start = performance.now()
  execSync('pnpm build', { cwd: appDir, stdio: 'pipe' })
  const buildTime = performance.now() - start

  // Find dist directory (SvelteKit uses build/)
  let distDir = join(appDir, 'dist')
  try {
    statSync(distDir)
  } catch {
    distDir = join(appDir, 'build')
  }

  const assetsDir = join(distDir, 'assets')
  let sizes: ReturnType<typeof getFileSizes>
  try {
    sizes = getFileSizes(assetsDir)
  } catch {
    // Fallback: scan entire dist
    sizes = getFileSizes(distDir)
  }

  return {
    framework,
    app,
    jsSize: sizes.js,
    jsSizeGzip: sizes.jsGzip,
    cssSize: sizes.css,
    cssSizeGzip: sizes.cssGzip,
    totalSize: sizes.js + sizes.css,
    totalSizeGzip: sizes.jsGzip + sizes.cssGzip,
    buildTimeMs: Math.round(buildTime),
  }
}
