import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { getFilters, setFilter, subscribe } from '../store'

@customElement('search-bar')
class SearchBar extends LitElement {
  @state() private query = ''
  private debounceTimer = 0
  private unsubscribe?: () => void

  connectedCallback() {
    super.connectedCallback()
    this.query = getFilters().search || ''
    this.unsubscribe = subscribe(() => {
      const search = getFilters().search || ''
      if (this.query !== search) this.query = search
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.unsubscribe?.()
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
  }

  private handleInput(e: InputEvent) {
    this.query = (e.target as HTMLInputElement).value
    if (this.debounceTimer) clearTimeout(this.debounceTimer)
    this.debounceTimer = window.setTimeout(() => {
      setFilter('search', this.query)
    }, 300)
  }

  render() {
    return html`
      <input
        type="text"
        .value=${this.query}
        @input=${this.handleInput}
        placeholder="Search tasks..."
        class="w-full px-4 py-2 border rounded text-sm mb-4"
      />
    `
  }

  createRenderRoot() { return this }
}
