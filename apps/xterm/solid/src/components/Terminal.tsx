import { createSignal, onMount, onCleanup } from 'solid-js'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

const SOLID_STATUS_ICON = `<svg viewBox="0 0 166 155.3" width="16" height="16"><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" fill="#76b3e1"/><linearGradient id="sa" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf0fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" opacity=".3" fill="url(#sa)"/><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" fill="#518ac8"/><linearGradient id="sb" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" opacity=".3" fill="url(#sb)"/></svg>`

interface Props {
  wsUrl: string
}

export default function TerminalComponent(props: Props) {
  let containerRef!: HTMLDivElement
  const [connected, setConnected] = createSignal(false)

  onMount(() => {
    const terminal = new Terminal({
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

    const fitAddon = new FitAddon()
    const searchAddon = new SearchAddon()
    const webLinksAddon = new WebLinksAddon()

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(searchAddon)
    terminal.loadAddon(webLinksAddon)
    terminal.open(containerRef)

    let ws: WebSocket | null = null
    let disposed = false

    // Wait for terminal to render, then fit and connect WebSocket
    const initTimeout = setTimeout(() => {
      if (disposed) return

      try {
        fitAddon.fit()
      } catch {
        // ignore fit errors
      }

      ws = new WebSocket(props.wsUrl)

      ws.onopen = () => {
        if (disposed) { ws?.close(); return }
        setConnected(true)
        try {
          const dims = fitAddon.proposeDimensions()
          if (dims) {
            ws!.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }))
          }
        } catch {
          // ignore
        }
      }

      ws.onmessage = (event) => {
        if (!disposed) terminal.write(event.data)
      }

      ws.onclose = () => {
        if (!disposed) {
          setConnected(false)
          terminal.write('\r\n\x1b[31m[Disconnected]\x1b[0m\r\n')
        }
      }

      ws.onerror = () => {
        if (!disposed) setConnected(false)
      }

      terminal.onData((data) => {
        if (ws?.readyState === WebSocket.OPEN) ws.send(data)
      })

      terminal.onResize(({ cols, rows }) => {
        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols, rows }))
        }
      })
    }, 200)

    const handleWindowResize = () => {
      try { fitAddon.fit() } catch { /* ignore */ }
    }
    window.addEventListener('resize', handleWindowResize)

    onCleanup(() => {
      disposed = true
      clearTimeout(initTimeout)
      window.removeEventListener('resize', handleWindowResize)
      ws?.close()
      terminal.dispose()
    })
  })

  return (
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div class={`w-2.5 h-2.5 rounded-full ${connected() ? 'bg-green-400' : 'bg-red-400'}`} />
        <span class="text-sm text-gray-400">
          {connected() ? 'Connected' : 'Disconnected'}
        </span>
        <span class="flex items-center gap-1.5 text-xs text-gray-600">
          <span innerHTML={SOLID_STATUS_ICON} />
          xterm.js
        </span>
      </div>
      <div ref={el => containerRef = el} class="flex-1 min-h-0" />
    </div>
  )
}
