import { useRef, useState, useEffect } from 'react'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

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

    // Wait for terminal to render, then fit and connect WebSocket
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
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
        <span className="text-sm text-gray-400">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-600"><span dangerouslySetInnerHTML={{ __html: '<svg viewBox="-11.5 -10.232 23 20.463" width="16" height="16"><circle r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" fill="none" stroke-width="1"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>' }} />xterm.js</span>
      </div>
      <div ref={containerRef} className="flex-1 min-h-0" />
    </div>
  )
}
