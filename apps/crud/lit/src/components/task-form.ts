import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { taskSchema, type TaskFormData } from '../schemas/task'
import type { Category } from '../../../../../shared/types'

@customElement('task-form')
class TaskForm extends LitElement {
  @property({ type: Array }) categories: Category[] = []
  @property({ type: Object }) defaultValues: Partial<TaskFormData> = {}
  @property({ type: Boolean }) isSubmitting = false

  @state() private title = ''
  @state() private description = ''
  @state() private status: TaskFormData['status'] = 'pending'
  @state() private priority: TaskFormData['priority'] = 'medium'
  @state() private categoryId = 1
  @state() private errors: Record<string, string> = {}
  private initialized = false

  updated(changed: Map<string, unknown>) {
    if (changed.has('defaultValues') && !this.initialized && this.defaultValues.title) {
      this.title = this.defaultValues.title || ''
      this.description = this.defaultValues.description || ''
      this.status = this.defaultValues.status || 'pending'
      this.priority = this.defaultValues.priority || 'medium'
      this.categoryId = this.defaultValues.categoryId || 1
      this.initialized = true
    }
  }

  private handleSubmit(e: Event) {
    e.preventDefault()
    const data = {
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      categoryId: this.categoryId,
    }

    const result = taskSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      this.errors = fieldErrors
      return
    }

    this.errors = {}
    this.dispatchEvent(new CustomEvent<TaskFormData>('submit-task', {
      detail: result.data,
      bubbles: true,
      composed: true,
    }))
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit} class="space-y-4 max-w-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            .value=${this.title}
            @input=${(e: InputEvent) => { this.title = (e.target as HTMLInputElement).value }}
            class="w-full px-3 py-2 border rounded text-sm"
          />
          ${this.errors.title ? html`<p class="text-red-500 text-xs mt-1">${this.errors.title}</p>` : html``}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            .value=${this.description}
            @input=${(e: InputEvent) => { this.description = (e.target as HTMLTextAreaElement).value }}
            rows="3"
            class="w-full px-3 py-2 border rounded text-sm"
          ></textarea>
          ${this.errors.description ? html`<p class="text-red-500 text-xs mt-1">${this.errors.description}</p>` : html``}
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              .value=${this.status}
              @change=${(e: Event) => { this.status = (e.target as HTMLSelectElement).value as TaskFormData['status'] }}
              class="w-full px-3 py-2 border rounded text-sm bg-white"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              .value=${this.priority}
              @change=${(e: Event) => { this.priority = (e.target as HTMLSelectElement).value as TaskFormData['priority'] }}
              class="w-full px-3 py-2 border rounded text-sm bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              .value=${String(this.categoryId)}
              @change=${(e: Event) => { this.categoryId = Number((e.target as HTMLSelectElement).value) }}
              class="w-full px-3 py-2 border rounded text-sm bg-white"
            >
              ${this.categories.map((c) => html`
                <option value=${c.id}>${c.name}</option>
              `)}
            </select>
          </div>
        </div>

        <button
          type="submit"
          ?disabled=${this.isSubmitting}
          class="px-6 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          ${this.isSubmitting ? 'Saving...' : 'Save Task'}
        </button>
      </form>
    `
  }

  createRenderRoot() { return this }
}
