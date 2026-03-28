<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { Terminal } from '@xterm/xterm'
  import { FitAddon } from '@xterm/addon-fit'
  import { SearchAddon } from '@xterm/addon-search'
  import { WebLinksAddon } from '@xterm/addon-web-links'
  import '@xterm/xterm/css/xterm.css'

  let { wsUrl }: { wsUrl: string } = $props()

  let containerEl: HTMLDivElement
  let connected = $state(false)

  let terminal: Terminal
  let fitAddon: FitAddon
  let ws: WebSocket
  let initTimeout: ReturnType<typeof setTimeout>

  function handleResize() {
    try { fitAddon?.fit() } catch { /* ignore */ }
  }

  onMount(() => {
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
    terminal.open(containerEl)

    // Delay fit + WebSocket until terminal renderer is ready
    initTimeout = setTimeout(() => {
      try { fitAddon.fit() } catch { /* ignore */ }

      ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        connected = true
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
        connected = false
        terminal.write('\r\n\x1b[31m[Disconnected]\x1b[0m\r\n')
      }

      ws.onerror = () => {
        connected = false
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

  onDestroy(() => {
    clearTimeout(initTimeout)
    window.removeEventListener('resize', handleResize)
    ws?.close()
    terminal?.dispose()
  })
</script>

<div class="flex flex-col h-full">
  <div class="flex items-center gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700">
    <div class="w-2.5 h-2.5 rounded-full {connected ? 'bg-green-400' : 'bg-red-400'}"></div>
    <span class="text-sm text-gray-400">{connected ? 'Connected' : 'Disconnected'}</span>
    <span class="flex items-center gap-1.5 text-xs text-gray-600"><span>{@html '<svg viewBox="0 0 98.1 118" width="16" height="16"><path d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.3 21.3-2.4 3.6-4 7.6-4.7 11.8-1.6 8.9.5 18.1 5.7 25.4 11 15.7 32.6 20.3 48.2 10.4l27.5-17.6c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.3-21.3 2.4-3.6 4-7.6 4.7-11.8 1.7-9-.4-18.2-5.7-25.4" fill="#FF3E00"/><path d="M40.9 103.9a22.7 22.7 0 0 1-9.3-25.5l.6-2.1 1.5 1a50 50 0 0 0 15 7.5l1.4.4-.1 1.4a6.9 6.9 0 0 0 1.2 4.4 7 7 0 0 0 8.6 2.7 6.5 6.5 0 0 0 1.9-1l27.5-17.6a6.3 6.3 0 0 0 2.8-4.5 6.7 6.7 0 0 0-1.2-4.9 7 7 0 0 0-8.6-2.7 6.5 6.5 0 0 0-1.9 1l-10.5 6.7a21.3 21.3 0 0 1-6 3.2 22.4 22.4 0 0 1-17.4-.5 22.7 22.7 0 0 1-9.3-25.5 20.6 20.6 0 0 1 9.2-14.5L74.2 16a21.3 21.3 0 0 1 6-3.2c8.6-3.2 18.1-.6 24.4 6.3a22.7 22.7 0 0 1 3.3 23.4l-.6 2.1-1.5-1a50 50 0 0 0-15-7.5l-1.4-.4.1-1.4a6.9 6.9 0 0 0-1.2-4.4 7 7 0 0 0-8.6-2.7 6.5 6.5 0 0 0-1.9 1L50.3 46.3a6.3 6.3 0 0 0-2.8 4.5c-.2 1.9.3 3.5 1.2 4.9a7 7 0 0 0 8.6 2.7 6.5 6.5 0 0 0 1.9-1l10.5-6.7a21.3 21.3 0 0 1 6-3.2 22.4 22.4 0 0 1 17.4.5 22.7 22.7 0 0 1 9.3 25.5 20.6 20.6 0 0 1-9.2 14.5l-27.5 17.6a21.3 21.3 0 0 1-6 3.2 22.2 22.2 0 0 1-8.8 1" fill="#fff"/></svg>'}</span>xterm.js</span>
  </div>
  <div bind:this={containerEl} class="flex-1 min-h-0"></div>
</div>
