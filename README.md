# React vs Vue vs Svelte vs Solid — Real-World Comparison

Side-by-side comparison of React, Vue, Svelte, and Solid using identical apps. Not synthetic benchmarks or hello worlds — actual apps you'd build at work.

![Dashboard](.github/dashboard.png)

## What's Inside

### 3 App Types × 4 Frameworks = 12 Apps

| App | What it does | What it tests |
|-----|-------------|---------------|
| **Performance Stress Test** | 10k row table, deep component tree, rapid state updates | Raw rendering speed, reactivity, memory usage |
| **CRUD Task Manager** | Full task manager with filters, search, pagination, forms | Real-world DX, ecosystem packages, code volume |
| **Terminal Streamer** | Web terminal connected to a real shell via WebSocket | High-frequency DOM updates, streaming data, lifecycle management |

### Ecosystem Used

| | React | Vue | Svelte | Solid |
|---|---|---|---|---|
| **Routing** | React Router v7 | Vue Router | SvelteKit | @solidjs/router |
| **State** | Zustand | Pinia | Svelte stores | createSignal |
| **Server State** | TanStack Query | TanStack Vue Query | fetch + load functions | createResource |
| **Forms** | React Hook Form + Zod | VeeValidate + Zod | Native bindings + Zod | Native bindings + Zod |
| **Terminal** | xterm.js | xterm.js | xterm.js | xterm.js |
| **Styling** | Tailwind v4 | Tailwind v4 | Tailwind v4 | Tailwind v4 |

## Benchmark Results

Measured with Playwright headless Chromium. Median of 3 runs. All four apps render the same UI with the same data.

### Rendering Performance (ms, lower is better)

| Benchmark | React | Vue | Svelte | Solid |
|---|--:|--:|--:|--:|
| Create 10,000 rows | 820.1 | 265.1 | 467.3 | **223.8** |
| Update every 10th row | 251.3 | 50.0 | **35.9** | 52.9 |
| Swap rows | 190.8 | 44.8 | 42.6 | **26.1** |
| Select row | 248.3 | 28.4 | **15.0** | 216.3 |
| Append 1,000 rows | 207.6 | 68.6 | 94.4 | **44.1** |
| Clear all | 63.3 | 31.2 | 28.1 | **24.1** |

### Bundle Size (JS gzipped)

| App | React | Vue | Svelte | Solid |
|---|--:|--:|--:|--:|
| Perf Stress Test | 62.4 KB | 28.1 KB | 18.0 KB | **8.1 KB** |
| Terminal Streamer | 135.3 KB | 99.6 KB | 87.4 KB | **79.1 KB** |

### What the numbers say

- **Solid is fastest for bulk operations** — creating 10k rows (224ms), appending 1k (44ms), and clearing (24ms) are all best-in-class. Fine-grained reactivity + no VDOM = minimal overhead.
- **Svelte wins targeted single-element updates** — selecting one row in 15ms vs Solid's 216ms. Svelte's compiled reactivity tracks exactly which DOM nodes to touch.
- **Solid ships the least code** — 8.1KB gzipped for the perf app. That's 7.7x smaller than React (62.4KB) and 2.2x smaller than Svelte (18KB).
- **Vue is the all-rounder** — competitive across every benchmark, never the slowest, and its template compiler + proxy reactivity is well-optimized.
- **React has the most overhead** — consistently 3-10x slower than the others on partial updates. The VDOM diffing cost scales with list size.

> Numbers will vary by machine. Run `pnpm dev:all` and test yourself.

## Quick Start

```bash
pnpm install
pnpm dev:all
```

Open **http://localhost:1355** — dashboard with links to all 12 apps.

## Running Individual Apps

```bash
# Backends (needed for CRUD and Terminal apps)
pnpm dev:server:json    # REST API on :3100
pnpm dev:server:pty     # WebSocket terminal on :3200

# Performance
pnpm dev:perf:react     # :5101
pnpm dev:perf:vue       # :5102
pnpm dev:perf:svelte    # :5103
pnpm dev:perf:solid     # :5104

# CRUD
pnpm dev:crud:react     # :5201
pnpm dev:crud:vue       # :5202
pnpm dev:crud:svelte    # :5203
pnpm dev:crud:solid     # :5204

# Terminal
pnpm dev:xterm:react    # :5301
pnpm dev:xterm:vue      # :5302
pnpm dev:xterm:svelte   # :5303
pnpm dev:xterm:solid    # :5304
```

## Adding a New Framework

```bash
pnpm add-framework <name>
```

Generates all 3 apps with correct ports and TODO placeholders. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

## Running Benchmarks

```bash
pnpm bench                                          # all benchmarks
pnpm bench -- --app perf-stress --framework react   # specific app/framework
pnpm bench -- --runs 10                             # more iterations
```

Results are written to `results/comparison.md`.

## Running Tests

```bash
pnpm e2e        # 42 Playwright E2E tests across all apps
```

## Project Structure

```
├── dashboard/           # Index page on :1355
├── apps/
│   ├── perf-stress/     # react/ vue/ svelte/ solid/
│   ├── crud/            # react/ vue/ svelte/ solid/
│   └── xterm/           # react/ vue/ svelte/ solid/
├── server/
│   ├── json/            # json-server for CRUD apps
│   └── pty/             # node-pty + WebSocket for terminal apps
├── bench/               # Playwright-based benchmark runner
├── shared/              # Types, benchmark utilities
└── e2e/                 # E2E smoke tests
```

## Tech Stack

- **Build**: Vite 6, pnpm workspaces
- **React** 19, **Vue** 3.5, **Svelte** 5 (runes), **Solid** 1.9
- **Tailwind CSS** v4
- **TypeScript** throughout
- **Playwright** for benchmarks and E2E tests

## License

MIT
