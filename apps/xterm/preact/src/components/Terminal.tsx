import { useRef, useState, useEffect } from 'preact/hooks'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

const PREACT_ICON_SM = `<svg viewBox="0 0 256 296" width="16" height="16"><path d="M128 0L256 73.9V222.1L128 296L0 222.1V73.9L128 0z" fill="#673AB8"/><path d="M34.865 220.478c17.016 21.78 71.095 5.185 122.15-34.704s81.988-88.196 64.972-109.975c-17.016-21.78-71.095-5.185-122.15 34.704S17.849 198.699 34.865 220.478z" stroke="#fff" stroke-width="16" fill="none"/><path d="M220.875 220.478c-17.016 21.78-71.095 5.185-122.15-34.704S16.737 97.578 33.753 75.799c17.016-21.78 71.095-5.185 122.15 34.704s81.988 88.196 64.972 109.975z" stroke="#fff" stroke-width="16" fill="none"/><circle cx="128" cy="148" r="17" fill="#fff"/></svg>`

interface Props {
  wsUrl: string
}

export default function TerminalComponent({ wsUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

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
    terminal.open(containerRef.current)

    let ws: WebSocket | null = null
    let disposed = false

    const initTimeout = setTimeout(() => {
      if (disposed) return

      try {
        fitAddon.fit()
      } catch {
        // ignore fit errors
      }

      ws = new WebSocket(wsUrl)

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

    return () => {
      disposed = true
      clearTimeout(initTimeout)
      window.removeEventListener('resize', handleWindowResize)
      ws?.close()
      terminal.dispose()
    }
  }, [wsUrl])

  return (
    <div class="flex flex-col h-full">
      <div class="flex items-center gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div class={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
        <span class="text-sm text-gray-400">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
        <span class="flex items-center gap-1.5 text-xs text-gray-600">
          <span dangerouslySetInnerHTML={{ __html: PREACT_ICON_SM }} />
          xterm.js
        </span>
      </div>
      <div ref={containerRef} class="flex-1 min-h-0" />
    </div>
  )
}
