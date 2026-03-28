import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { getFilters, setFilter, subscribe } from '../store'

@customElement('task-pagination')
class TaskPagination extends LitElement {
  @property({ type: Number }) totalCount = 0
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
    const page = this.filters.page || 1
    const perPage = this.filters.perPage || 10
    const totalPages = Math.ceil(this.totalCount / perPage)

    if (totalPages <= 1) return html``

    return html`
      <div class="flex items-center justify-between mt-6">
        <p class="text-sm text-gray-500">
          Page ${page} of ${totalPages} (${this.totalCount} tasks)
        </p>
        <div class="flex gap-2">
          <button
            @click=${() => setFilter('page', page - 1)}
            ?disabled=${page <= 1}
            class="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            @click=${() => setFilter('page', page + 1)}
            ?disabled=${page >= totalPages}
            class="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    `
  }

  createRenderRoot() { return this }
}
