import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { getFilters, setFilter, resetFilters, subscribe } from '../store'
import type { Category } from '../../../../../shared/types'

@customElement('task-filters')
class TaskFilters extends LitElement {
  @property({ type: Array }) categories: Category[] = []
  @state() private filters = getFilters()
  private unsubscribe?: () => void

  connectedCallback() {
    super.connectedCallback()
    this.unsubscribe = subscribe(() => {
      this.filters = { ...getFilters() }
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.unsubscribe?.()
  }

  render() {
    return html`
      <div class="flex flex-wrap gap-3 items-center mb-6">
        <select
          .value=${this.filters.status || 'all'}
          @change=${(e: Event) => setFilter('status', (e.target as HTMLSelectElement).value as any)}
          class="px-3 py-2 border rounded text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          .value=${String(this.filters.categoryId || '')}
          @change=${(e: Event) => {
            const val = (e.target as HTMLSelectElement).value
            setFilter('categoryId', val ? Number(val) : undefined)
          }}
          class="px-3 py-2 border rounded text-sm bg-white"
        >
          <option value="">All Categories</option>
          ${this.categories.map((c) => html`
            <option value=${c.id}>${c.name}</option>
          `)}
        </select>

        <select
          .value=${this.filters.sortBy || 'createdAt'}
          @change=${(e: Event) => setFilter('sortBy', (e.target as HTMLSelectElement).value as any)}
          class="px-3 py-2 border rounded text-sm bg-white"
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
          <option value="priority">Priority</option>
        </select>

        <button
          @click=${() => setFilter('sortOrder', this.filters.sortOrder === 'asc' ? 'desc' : 'asc')}
          class="px-3 py-2 border rounded text-sm bg-white hover:bg-gray-50"
        >
          ${this.filters.sortOrder === 'asc' ? '\u2191 Asc' : '\u2193 Desc'}
        </button>

        <button
          @click=${() => resetFilters()}
          class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Reset
        </button>
      </div>
    `
  }

  createRenderRoot() { return this }
}
