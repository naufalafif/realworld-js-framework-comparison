import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import './components/terminal-view'

const LIT_ICON = `<svg viewBox="0 0 160 200" width="28" height="28"><path d="M40 120l40-120 40 80-40 40-20-20z" fill="#00E8FF"/><path d="M40 120l20 20 40-40v80l-60-40z" fill="#283198"/><path d="M100 180v-80l40-40v80z" fill="#324FFF"/><path d="M40 120l60 60v-80l-40 40z" fill="#0FF"/></svg>`

@customElement('xterm-app')
class XtermApp extends LitElement {
  render() {
    return html`
      <div class="h-screen flex flex-col bg-gray-900">
        <div class="flex items-center gap-3 px-4 py-2 bg-gray-900 border-b border-gray-700">
          <span .innerHTML=${LIT_ICON}></span>
          <h1 class="text-lg font-bold text-gray-100">Terminal — Lit</h1>
          <span class="text-xs text-gray-500">Lit 3 &bull; Vite &bull; TypeScript</span>
          <a href="http://localhost:1355" class="ml-auto text-xs text-gray-500 hover:text-gray-300">&larr; Dashboard</a>
        </div>
        <div class="flex-1 min-h-0">
          <terminal-view wsUrl="ws://localhost:3200"></terminal-view>
        </div>
      </div>
    `
  }

  createRenderRoot() { return this }
}
