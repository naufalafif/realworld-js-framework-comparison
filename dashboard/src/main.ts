interface AppEntry {
  name: string
  port: number
  framework: 'react' | 'vue' | 'svelte' | 'solid' | 'preact' | 'lit'
  type: 'perf' | 'crud' | 'xterm'
  description: string
}

interface ServerEntry {
  name: string
  port: number
  description: string
}

const servers: ServerEntry[] = [
  { name: 'JSON Server', port: 3100, description: 'REST API for CRUD apps' },
  { name: 'PTY Server', port: 3200, description: 'WebSocket terminal backend' },
]

const apps: AppEntry[] = [
  { name: 'React Perf', port: 5101, framework: 'react', type: 'perf', description: '10k rows, deep tree, rapid updates' },
  { name: 'Vue Perf', port: 5102, framework: 'vue', type: 'perf', description: '10k rows, deep tree, rapid updates' },
  { name: 'Svelte Perf', port: 5103, framework: 'svelte', type: 'perf', description: '10k rows, deep tree, rapid updates' },
  { name: 'Solid Perf', port: 5104, framework: 'solid', type: 'perf', description: 'Fine-grained reactivity, no VDOM' },
  { name: 'Preact Perf', port: 5105, framework: 'preact', type: 'perf', description: 'React API in 3KB, no VDOM overhead' },
  { name: 'Lit Perf', port: 5106, framework: 'lit', type: 'perf', description: 'Web Components, tagged templates' },
  { name: 'React CRUD', port: 5201, framework: 'react', type: 'crud', description: 'React Router, Zustand, TanStack Query' },
  { name: 'Vue CRUD', port: 5202, framework: 'vue', type: 'crud', description: 'Vue Router, Pinia, TanStack Vue Query' },
  { name: 'Svelte CRUD', port: 5203, framework: 'svelte', type: 'crud', description: 'SvelteKit, Svelte stores, native bindings' },
  { name: 'Solid CRUD', port: 5204, framework: 'solid', type: 'crud', description: '@solidjs/router, createSignal, Zod' },
  { name: 'Preact CRUD', port: 5205, framework: 'preact', type: 'crud', description: 'preact-router, @preact/signals, Zod' },
  { name: 'Lit CRUD', port: 5206, framework: 'lit', type: 'crud', description: 'Hash router, LitElement, Zod' },
  { name: 'React Terminal', port: 5301, framework: 'react', type: 'xterm', description: 'xterm.js + WebSocket' },
  { name: 'Vue Terminal', port: 5302, framework: 'vue', type: 'xterm', description: 'xterm.js + WebSocket' },
  { name: 'Svelte Terminal', port: 5303, framework: 'svelte', type: 'xterm', description: 'xterm.js + WebSocket' },
  { name: 'Solid Terminal', port: 5304, framework: 'solid', type: 'xterm', description: 'xterm.js + WebSocket' },
  { name: 'Preact Terminal', port: 5305, framework: 'preact', type: 'xterm', description: 'xterm.js + WebSocket' },
  { name: 'Lit Terminal', port: 5306, framework: 'lit', type: 'xterm', description: 'xterm.js + WebSocket' },
]

const frameworkIcons: Record<string, { svg: string; svgLarge: string; color: string; name: string }> = {
  react: {
    svg: `<svg viewBox="-11.5 -10.232 23 20.463" width="20" height="20"><circle r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" fill="none" stroke-width="1"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
    svgLarge: `<svg viewBox="-11.5 -10.232 23 20.463" width="24" height="24"><circle r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" fill="none" stroke-width="1"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
    color: 'text-sky-400',
    name: 'React',
  },
  vue: {
    svg: `<svg viewBox="0 0 261.76 226.69" width="20" height="20"><path d="m161.096.001-30.224 52.35L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41B883"/><path d="m161.096.001-30.224 52.35L100.647.001H52.346l78.526 136.01L209.398.001z" fill="#34495E"/></svg>`,
    svgLarge: `<svg viewBox="0 0 261.76 226.69" width="24" height="24"><path d="m161.096.001-30.224 52.35L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41B883"/><path d="m161.096.001-30.224 52.35L100.647.001H52.346l78.526 136.01L209.398.001z" fill="#34495E"/></svg>`,
    color: 'text-emerald-400',
    name: 'Vue',
  },
  svelte: {
    svg: `<svg viewBox="0 0 98.1 118" width="20" height="20"><path d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.3 21.3-2.4 3.6-4 7.6-4.7 11.8-1.6 8.9.5 18.1 5.7 25.4 11 15.7 32.6 20.3 48.2 10.4l27.5-17.6c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.3-21.3 2.4-3.6 4-7.6 4.7-11.8 1.7-9-.4-18.2-5.7-25.4" fill="#FF3E00"/><path d="M40.9 103.9a22.7 22.7 0 0 1-9.3-25.5l.6-2.1 1.5 1a50 50 0 0 0 15 7.5l1.4.4-.1 1.4a6.9 6.9 0 0 0 1.2 4.4 7 7 0 0 0 8.6 2.7 6.5 6.5 0 0 0 1.9-1l27.5-17.6a6.3 6.3 0 0 0 2.8-4.5 6.7 6.7 0 0 0-1.2-4.9 7 7 0 0 0-8.6-2.7 6.5 6.5 0 0 0-1.9 1l-10.5 6.7a21.3 21.3 0 0 1-6 3.2 22.4 22.4 0 0 1-17.4-.5 22.7 22.7 0 0 1-9.3-25.5 20.6 20.6 0 0 1 9.2-14.5L74.2 16a21.3 21.3 0 0 1 6-3.2c8.6-3.2 18.1-.6 24.4 6.3a22.7 22.7 0 0 1 3.3 23.4l-.6 2.1-1.5-1a50 50 0 0 0-15-7.5l-1.4-.4.1-1.4a6.9 6.9 0 0 0-1.2-4.4 7 7 0 0 0-8.6-2.7 6.5 6.5 0 0 0-1.9 1L50.3 46.3a6.3 6.3 0 0 0-2.8 4.5c-.2 1.9.3 3.5 1.2 4.9a7 7 0 0 0 8.6 2.7 6.5 6.5 0 0 0 1.9-1l10.5-6.7a21.3 21.3 0 0 1 6-3.2 22.4 22.4 0 0 1 17.4.5 22.7 22.7 0 0 1 9.3 25.5 20.6 20.6 0 0 1-9.2 14.5l-27.5 17.6a21.3 21.3 0 0 1-6 3.2 22.2 22.2 0 0 1-8.8 1" fill="#fff"/></svg>`,
    svgLarge: `<svg viewBox="0 0 98.1 118" width="24" height="24"><path d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.3 21.3-2.4 3.6-4 7.6-4.7 11.8-1.6 8.9.5 18.1 5.7 25.4 11 15.7 32.6 20.3 48.2 10.4l27.5-17.6c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.3-21.3 2.4-3.6 4-7.6 4.7-11.8 1.7-9-.4-18.2-5.7-25.4" fill="#FF3E00"/><path d="M40.9 103.9a22.7 22.7 0 0 1-9.3-25.5l.6-2.1 1.5 1a50 50 0 0 0 15 7.5l1.4.4-.1 1.4a6.9 6.9 0 0 0 1.2 4.4 7 7 0 0 0 8.6 2.7 6.5 6.5 0 0 0 1.9-1l27.5-17.6a6.3 6.3 0 0 0 2.8-4.5 6.7 6.7 0 0 0-1.2-4.9 7 7 0 0 0-8.6-2.7 6.5 6.5 0 0 0-1.9 1l-10.5 6.7a21.3 21.3 0 0 1-6 3.2 22.4 22.4 0 0 1-17.4-.5 22.7 22.7 0 0 1-9.3-25.5 20.6 20.6 0 0 1 9.2-14.5L74.2 16a21.3 21.3 0 0 1 6-3.2c8.6-3.2 18.1-.6 24.4 6.3a22.7 22.7 0 0 1 3.3 23.4l-.6 2.1-1.5-1a50 50 0 0 0-15-7.5l-1.4-.4.1-1.4a6.9 6.9 0 0 0-1.2-4.4 7 7 0 0 0-8.6-2.7 6.5 6.5 0 0 0-1.9 1L50.3 46.3a6.3 6.3 0 0 0-2.8 4.5c-.2 1.9.3 3.5 1.2 4.9a7 7 0 0 0 8.6 2.7 6.5 6.5 0 0 0 1.9-1l10.5-6.7a21.3 21.3 0 0 1 6-3.2 22.4 22.4 0 0 1 17.4.5 22.7 22.7 0 0 1 9.3 25.5 20.6 20.6 0 0 1-9.2 14.5l-27.5 17.6a21.3 21.3 0 0 1-6 3.2 22.2 22.2 0 0 1-8.8 1" fill="#fff"/></svg>`,
    color: 'text-orange-400',
    name: 'Svelte',
  },
  solid: {
    svg: `<svg viewBox="0 0 166 155.3" width="20" height="20"><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" fill="#76b3e1"/><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf0fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" opacity=".3" fill="url(#a)"/><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" fill="#518ac8"/><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" opacity=".3" fill="url(#b)"/></svg>`,
    svgLarge: `<svg viewBox="0 0 166 155.3" width="24" height="24"><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" fill="#76b3e1"/><linearGradient id="a2" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf0fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" opacity=".3" fill="url(#a2)"/><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" fill="#518ac8"/><linearGradient id="b2" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" opacity=".3" fill="url(#b2)"/></svg>`,
    color: 'text-blue-300',
    name: 'Solid',
  },
  preact: {
    svg: `<svg viewBox="0 0 256 296" width="20" height="20"><path d="M128 0L256 73.9V222.1L128 296L0 222.1V73.9L128 0z" fill="#673AB8"/><path d="M34.865 220.478c17.016 21.78 71.095 5.185 122.15-34.704s81.988-88.196 64.972-109.975c-17.016-21.78-71.095-5.185-122.15 34.704S17.849 198.699 34.865 220.478z" stroke="#fff" stroke-width="16" fill="none"/><path d="M220.875 220.478c-17.016 21.78-71.095 5.185-122.15-34.704S16.737 97.578 33.753 75.799c17.016-21.78 71.095-5.185 122.15 34.704s81.988 88.196 64.972 109.975z" stroke="#fff" stroke-width="16" fill="none"/><circle cx="128" cy="148" r="17" fill="#fff"/></svg>`,
    svgLarge: `<svg viewBox="0 0 256 296" width="24" height="24"><path d="M128 0L256 73.9V222.1L128 296L0 222.1V73.9L128 0z" fill="#673AB8"/><path d="M34.865 220.478c17.016 21.78 71.095 5.185 122.15-34.704s81.988-88.196 64.972-109.975c-17.016-21.78-71.095-5.185-122.15 34.704S17.849 198.699 34.865 220.478z" stroke="#fff" stroke-width="16" fill="none"/><path d="M220.875 220.478c-17.016 21.78-71.095 5.185-122.15-34.704S16.737 97.578 33.753 75.799c17.016-21.78 71.095-5.185 122.15 34.704s81.988 88.196 64.972 109.975z" stroke="#fff" stroke-width="16" fill="none"/><circle cx="128" cy="148" r="17" fill="#fff"/></svg>`,
    color: 'text-purple-400',
    name: 'Preact',
  },
  lit: {
    svg: `<svg viewBox="0 0 160 200" width="20" height="20"><path d="M40 120l40-120 40 80-40 40-20-20z" fill="#00E8FF"/><path d="M40 120l20 20 40-40v80l-60-40z" fill="#283198"/><path d="M100 180v-80l40-40v80z" fill="#324FFF"/><path d="M40 120l60 60v-80l-40 40z" fill="#0FF"/></svg>`,
    svgLarge: `<svg viewBox="0 0 160 200" width="24" height="24"><path d="M40 120l40-120 40 80-40 40-20-20z" fill="#00E8FF"/><path d="M40 120l20 20 40-40v80l-60-40z" fill="#283198"/><path d="M100 180v-80l40-40v80z" fill="#324FFF"/><path d="M40 120l60 60v-80l-40 40z" fill="#0FF"/></svg>`,
    color: 'text-cyan-400',
    name: 'Lit',
  },
}

const typeLabels: Record<string, { label: string; icon: string; subtitle: string; accent: string; cardBorder: string; cardBg: string }> = {
  perf: {
    label: 'Performance Stress Test',
    icon: '⚡',
    subtitle: '10k rows, deep trees, rapid state updates — raw framework speed',
    accent: 'border-amber-500/60',
    cardBorder: 'border-l-amber-500/40 hover:border-l-amber-400',
    cardBg: 'bg-amber-950/10 hover:bg-amber-950/20',
  },
  crud: {
    label: 'CRUD Task Manager',
    icon: '📋',
    subtitle: 'Routing, state, forms, validation — real-world app with ecosystem packages',
    accent: 'border-violet-500/60',
    cardBorder: 'border-l-violet-500/40 hover:border-l-violet-400',
    cardBg: 'bg-violet-950/10 hover:bg-violet-950/20',
  },
  xterm: {
    label: 'Terminal Streamer',
    icon: '🖥',
    subtitle: 'Live shell over WebSocket — high-frequency DOM updates and streaming',
    accent: 'border-emerald-500/60',
    cardBorder: 'border-l-emerald-500/40 hover:border-l-emerald-400',
    cardBg: 'bg-emerald-950/10 hover:bg-emerald-950/20',
  },
}

async function checkHealth(port: number): Promise<boolean> {
  try {
    const res = await fetch(`http://localhost:${port}`, { mode: 'no-cors', signal: AbortSignal.timeout(2000) })
    return true
  } catch {
    return false
  }
}

function statusDot(id: string): string {
  return `<div id="${id}" class="w-2.5 h-2.5 rounded-full bg-gray-300 shrink-0" title="Checking..."></div>`
}

async function updateStatus(port: number, dotId: string) {
  const dot = document.getElementById(dotId)
  if (!dot) return
  const alive = await checkHealth(port)
  dot.className = `w-2.5 h-2.5 rounded-full shrink-0 ${alive ? 'bg-green-400' : 'bg-red-400'}`
  dot.title = alive ? 'Running' : 'Offline'
}

function frameworkLegend(): string {
  return `<div class="flex items-center gap-4 text-xs text-gray-500">
    <span class="flex items-center gap-1.5">${frameworkIcons.react.svg} <span class="text-sky-400">React</span></span>
    <span class="flex items-center gap-1.5">${frameworkIcons.vue.svg} <span class="text-emerald-400">Vue</span></span>
    <span class="flex items-center gap-1.5">${frameworkIcons.svelte.svg} <span class="text-orange-400">Svelte</span></span>
    <span class="flex items-center gap-1.5">${frameworkIcons.solid.svg} <span class="text-blue-300">Solid</span></span>
    <span class="flex items-center gap-1.5">${frameworkIcons.preact.svg} <span class="text-purple-400">Preact</span></span>
    <span class="flex items-center gap-1.5">${frameworkIcons.lit.svg} <span class="text-cyan-400">Lit</span></span>
  </div>`
}

function render() {
  const container = document.getElementById('app')!

  const types = ['perf', 'crud', 'xterm'] as const

  let html = `
    <div class="min-h-screen bg-gray-950 text-gray-100">
      <div class="max-w-6xl mx-auto px-6 py-10">
        <div class="mb-10">
          <h1 class="text-4xl font-bold text-white mb-2">JS Framework Comparison</h1>
          <p class="text-gray-400 text-lg mb-3">React vs Vue vs Svelte vs Solid vs Preact vs Lit — 18 apps, 3 categories, real benchmarks</p>
          ${frameworkLegend()}
        </div>

        <!-- Servers -->
        <div class="mb-10">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Backend Services</h2>
          <div class="flex gap-3">
            ${servers.map((s) => `
              <div class="flex items-center gap-3 px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg">
                ${statusDot(`server-${s.port}`)}
                <div>
                  <div class="text-sm font-medium text-gray-200">${s.name}</div>
                  <div class="text-xs text-gray-500">:${s.port} — ${s.description}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- App Groups -->
        ${types.map((type) => {
          const typeApps = apps.filter((a) => a.type === type)
          const t = typeLabels[type]
          return `
            <div class="mb-10">
              <div class="border-b ${t.accent} pb-3 mb-5">
                <h2 class="text-lg font-semibold text-white">
                  ${t.icon} ${t.label}
                </h2>
                <p class="text-sm text-gray-500 mt-1">${t.subtitle}</p>
              </div>
              <div class="grid grid-cols-6 gap-4">
                ${typeApps.map((app) => {
                  const fw = frameworkIcons[app.framework]
                  return `
                    <a href="http://localhost:${app.port}" target="_blank"
                       class="group block border-l-2 ${t.cardBorder} ${t.cardBg} border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-all">
                      <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2.5">
                          ${statusDot(`app-${app.port}`)}
                          <span class="flex items-center gap-1.5">
                            ${fw.svgLarge}
                            <span class="text-sm font-medium ${fw.color}">${fw.name}</span>
                          </span>
                        </div>
                        <span class="text-xs text-gray-600 font-mono">:${app.port}</span>
                      </div>
                      <p class="text-sm text-gray-400">${app.description}</p>
                      <div class="mt-3 text-xs text-gray-600 group-hover:text-gray-400 transition-colors">
                        Open in new tab →
                      </div>
                    </a>
                  `
                }).join('')}
              </div>
            </div>
          `
        }).join('')}

        <!-- Footer -->
        <div class="border-t border-gray-800 pt-6 text-xs text-gray-600">
          <p>Dashboard running on :1355 — Start all services with <code class="bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">pnpm dev:all</code></p>
        </div>
      </div>
    </div>
  `

  container.innerHTML = html

  // Check health
  servers.forEach((s) => updateStatus(s.port, `server-${s.port}`))
  apps.forEach((a) => updateStatus(a.port, `app-${a.port}`))

  // Refresh status every 5 seconds
  setInterval(() => {
    servers.forEach((s) => updateStatus(s.port, `server-${s.port}`))
    apps.forEach((a) => updateStatus(a.port, `app-${a.port}`))
  }, 5000)
}

render()
