# React vs Vue vs Svelte — Real-World Comparison

Side-by-side comparison of React, Vue, and Svelte using identical apps. Not synthetic benchmarks or hello worlds — actual apps you'd build at work.

## What's Inside

### 3 App Types × 3 Frameworks = 9 Apps

| App | What it does | What it tests |
|-----|-------------|---------------|
| **Performance Stress Test** | 10k row table, deep component tree, rapid state updates | Raw rendering speed, reactivity, memory usage |
| **CRUD Task Manager** | Full task manager with filters, search, pagination, forms | Real-world DX, ecosystem packages, code volume |
| **Terminal Streamer** | Web terminal connected to a real shell via WebSocket | High-frequency DOM updates, streaming data, lifecycle management |

### Ecosystem Used

| | React | Vue | Svelte |
|---|---|---|---|
| **Routing** | React Router v7 | Vue Router | SvelteKit |
| **State** | Zustand | Pinia | Svelte stores |
| **Server State** | TanStack Query | TanStack Vue Query | fetch + load functions |
| **Forms** | React Hook Form + Zod | VeeValidate + Zod | Native bindings + Zod |
| **Terminal** | xterm.js | xterm.js | xterm.js |
| **Styling** | Tailwind v4 | Tailwind v4 | Tailwind v4 |

## Quick Start

```bash
pnpm install
pnpm dev:all
```

Open **http://localhost:1355** — dashboard with links to all 9 apps.

## Running Individual Apps

```bash
# Backends (needed for CRUD and Terminal apps)
pnpm dev:server:json    # REST API on :3100
pnpm dev:server:pty     # WebSocket terminal on :3200

# Performance
pnpm dev:perf:react     # :5101
pnpm dev:perf:vue       # :5102
pnpm dev:perf:svelte    # :5103

# CRUD
pnpm dev:crud:react     # :5201
pnpm dev:crud:vue       # :5202
pnpm dev:crud:svelte    # :5203

# Terminal
pnpm dev:xterm:react    # :5301
pnpm dev:xterm:vue      # :5302
pnpm dev:xterm:svelte   # :5303
```

## Running Benchmarks

```bash
pnpm bench                                          # all benchmarks
pnpm bench -- --app perf-stress --framework react   # specific app/framework
pnpm bench -- --runs 10                             # more iterations
```

Results are written to `results/comparison.md`.

## Running Tests

```bash
pnpm e2e        # 32 Playwright E2E tests across all apps
```

## Project Structure

```
├── dashboard/           # Index page on :1355
├── apps/
│   ├── perf-stress/     # react/ vue/ svelte/
│   ├── crud/            # react/ vue/ svelte/
│   └── xterm/           # react/ vue/ svelte/
├── server/
│   ├── json/            # json-server for CRUD apps
│   └── pty/             # node-pty + WebSocket for terminal apps
├── bench/               # Playwright-based benchmark runner
├── shared/              # Types, benchmark utilities
└── e2e/                 # E2E smoke tests
```

## Tech Stack

- **Build**: Vite 6, pnpm workspaces
- **React** 19, **Vue** 3.5, **Svelte** 5 (runes)
- **Tailwind CSS** v4
- **TypeScript** throughout
- **Playwright** for benchmarks and E2E tests

## License

MIT
