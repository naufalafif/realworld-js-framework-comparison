<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

const props = defineProps<{ wsUrl: string }>()

const containerRef = ref<HTMLDivElement>()
const connected = ref(false)

let terminal: Terminal
let fitAddon: FitAddon
let ws: WebSocket
let initTimeout: ReturnType<typeof setTimeout>

onMounted(() => {
  if (!containerRef.value) return

  terminal = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: {
      background: '#1a1b26',
      foreground: '#a9b1d6',
      cursor: '#c0caf5',
      selectionBackground: '#33467c',
    },
    rows: 24,
    cols: 80,
  })

  fitAddon = new FitAddon()
  const searchAddon = new SearchAddon()
  const webLinksAddon = new WebLinksAddon()

  terminal.loadAddon(fitAddon)
  terminal.loadAddon(searchAddon)
  terminal.loadAddon(webLinksAddon)
  terminal.open(containerRef.value)

  // Delay fit + WebSocket until terminal renderer is ready
  initTimeout = setTimeout(() => {
    try { fitAddon.fit() } catch { /* ignore */ }

    ws = new WebSocket(props.wsUrl)

    ws.onopen = () => {
      connected.value = true
      try {
        const dims = fitAddon.proposeDimensions()
        if (dims) {
          ws.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }))
        }
      } catch { /* ignore */ }
    }

    ws.onmessage = (event) => {
      terminal.write(event.data)
    }

    ws.onclose = () => {
      connected.value = false
      terminal.write('\r\n\x1b[31m[Disconnected]\x1b[0m\r\n')
    }

    ws.onerror = () => {
      connected.value = false
    }

    terminal.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) ws.send(data)
    })

    terminal.onResize(({ cols, rows }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'resize', cols, rows }))
      }
    })
  }, 200)

  window.addEventListener('resize', handleResize)
})

function handleResize() {
  try { fitAddon?.fit() } catch { /* ignore */ }
}

onUnmounted(() => {
  clearTimeout(initTimeout)
  window.removeEventListener('resize', handleResize)
  ws?.close()
  terminal?.dispose()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div :class="['w-2.5 h-2.5 rounded-full', connected ? 'bg-green-400' : 'bg-red-400']" />
      <span class="text-sm text-gray-400">{{ connected ? 'Connected' : 'Disconnected' }}</span>
      <span class="flex items-center gap-1.5 text-xs text-gray-600"><span v-html="'<svg viewBox=&quot;0 0 261.76 226.69&quot; width=&quot;16&quot; height=&quot;16&quot;><path d=&quot;m161.096.001-30.224 52.35L100.647.001H-.005l130.877 226.688L261.749.001z&quot; fill=&quot;#41B883&quot;/><path d=&quot;m161.096.001-30.224 52.35L100.647.001H52.346l78.526 136.01L209.398.001z&quot; fill=&quot;#34495E&quot;/></svg>'"></span>xterm.js</span>
    </div>
    <div ref="containerRef" class="flex-1 min-h-0" />
  </div>
</template>
