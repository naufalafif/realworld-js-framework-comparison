import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'
import '@xterm/xterm/css/xterm.css'

@customElement('terminal-view')
class TerminalView extends LitElement {
  @property() wsUrl = ''
  @state() private connected = false

  private terminal?: Terminal
  private fitAddon?: FitAddon
  private ws?: WebSocket
  private disposed = false
  private initTimeout = 0

  private handleWindowResize = () => {
    try { this.fitAddon?.fit() } catch { /* ignore */ }
  }

  firstUpdated() {
    const container = this.querySelector('#terminal-container') as HTMLDivElement
    if (!container) return

    this.terminal = new Terminal({
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

    this.fitAddon = new FitAddon()
    const searchAddon = new SearchAddon()
    const webLinksAddon = new WebLinksAddon()

    this.terminal.loadAddon(this.fitAddon)
    this.terminal.loadAddon(searchAddon)
    this.terminal.loadAddon(webLinksAddon)
    this.terminal.open(container)

    this.initTimeout = window.setTimeout(() => {
      if (this.disposed) return

      try { this.fitAddon!.fit() } catch { /* ignore */ }

      this.ws = new WebSocket(this.wsUrl)

      this.ws.onopen = () => {
        if (this.disposed) { this.ws?.close(); return }
        this.connected = true
        try {
          const dims = this.fitAddon!.proposeDimensions()
          if (dims) {
            this.ws!.send(JSON.stringify({ type: 'resize', cols: dims.cols, rows: dims.rows }))
          }
        } catch { /* ignore */ }
      }

      this.ws.onmessage = (event) => {
        if (!this.disposed) this.terminal!.write(event.data)
      }

      this.ws.onclose = () => {
        if (!this.disposed) {
          this.connected = false
          this.terminal!.write('\r\n\x1b[31m[Disconnected]\x1b[0m\r\n')
        }
      }

      this.ws.onerror = () => {
        if (!this.disposed) this.connected = false
      }

      this.terminal!.onData((data) => {
        if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(data)
      })

      this.terminal!.onResize(({ cols, rows }) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'resize', cols, rows }))
        }
      })
    }, 200)

    window.addEventListener('resize', this.handleWindowResize)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.disposed = true
    clearTimeout(this.initTimeout)
    window.removeEventListener('resize', this.handleWindowResize)
    this.ws?.close()
    this.terminal?.dispose()
  }

  render() {
    return html`
      <div class="flex flex-col h-full">
        <div class="flex items-center gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div class="w-2.5 h-2.5 rounded-full ${this.connected ? 'bg-green-400' : 'bg-red-400'}"></div>
          <span class="text-sm text-gray-400">
            ${this.connected ? 'Connected' : 'Disconnected'}
          </span>
          <span class="flex items-center gap-1.5 text-xs text-gray-600">
            <span .innerHTML=${'<svg viewBox="0 0 160 200" width="16" height="16"><path d="M40 120l40-120 40 80-40 40-20-20z" fill="#00E8FF"/><path d="M40 120l20 20 40-40v80l-60-40z" fill="#283198"/><path d="M100 180v-80l40-40v80z" fill="#324FFF"/><path d="M40 120l60 60v-80l-40 40z" fill="#0FF"/></svg>'}></span>
            xterm.js
          </span>
        </div>
        <div id="terminal-container" class="flex-1 min-h-0"></div>
      </div>
    `
  }

  createRenderRoot() { return this }
}
