import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import type { Task, Category } from '../../../../shared/types'
import { fetchTasks, fetchCategories, deleteTask, createTask, updateTask, fetchTask } from './api/tasks'
import { getFilters, subscribe, resetFilters } from './store'
import type { TaskFormData } from './schemas/task'
import './components/search-bar'
import './components/task-filters'
import './components/task-list'
import './components/task-form'
import './components/pagination'

const LIT_ICON = `<svg viewBox="0 0 160 200" width="20" height="20"><path d="M40 120l40-120 40 80-40 40-20-20z" fill="#00E8FF"/><path d="M40 120l20 20 40-40v80l-60-40z" fill="#283198"/><path d="M100 180v-80l40-40v80z" fill="#324FFF"/><path d="M40 120l60 60v-80l-40 40z" fill="#0FF"/></svg>`

@customElement('crud-app')
class CrudApp extends LitElement {
  @state() private route = window.location.hash.slice(1) || '/'
  @state() private tasks: Task[] = []
  @state() private totalCount = 0
  @state() private categories: Category[] = []
  @state() private loading = false
  @state() private editTask: Task | null = null
  @state() private submitting = false
  @state() private allTasks: Task[] = []

  private unsubscribe?: () => void

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('hashchange', this.handleHashChange)
    this.unsubscribe = subscribe(() => {
      if (this.route === '/tasks') this.loadTasks()
    })
    this.loadCategories()
    this.loadAllTasks()
    this.routeChanged()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('hashchange', this.handleHashChange)
    this.unsubscribe?.()
  }

  private handleHashChange = () => {
    this.route = window.location.hash.slice(1) || '/'
    this.routeChanged()
  }

  private routeChanged() {
    if (this.route === '/tasks') {
      this.loadTasks()
    } else if (this.route.match(/^\/tasks\/(\d+)\/edit$/)) {
      this.loadEditTask()
    }
  }

  private async loadCategories() {
    this.categories = await fetchCategories()
  }

  private async loadAllTasks() {
    const result = await fetchTasks({ perPage: 1000 })
    this.allTasks = result.data
  }

  private async loadTasks() {
    this.loading = true
    const filters = getFilters()
    const result = await fetchTasks({
      _page: filters.page,
      _per_page: filters.perPage,
      _sort: filters.sortBy,
      _order: filters.sortOrder,
      status: filters.status,
      categoryId: filters.categoryId,
      q: filters.search,
    })
    this.tasks = result.data
    this.totalCount = result.totalCount
    this.loading = false
  }

  private async loadEditTask() {
    const match = this.route.match(/^\/tasks\/(\d+)\/edit$/)
    if (!match) return
    this.editTask = await fetchTask(Number(match[1]))
  }

  private async handleDeleteTask(e: CustomEvent<number>) {
    await deleteTask(e.detail)
    this.loadTasks()
    this.loadAllTasks()
  }

  private async handleCreateTask(e: CustomEvent<TaskFormData>) {
    this.submitting = true
    await createTask(e.detail)
    this.submitting = false
    this.loadAllTasks()
    window.location.hash = '#/tasks'
  }

  private async handleUpdateTask(e: CustomEvent<TaskFormData>) {
    const match = this.route.match(/^\/tasks\/(\d+)\/edit$/)
    if (!match) return
    this.submitting = true
    await updateTask(Number(match[1]), e.detail)
    this.submitting = false
    this.loadAllTasks()
    window.location.hash = '#/tasks'
  }

  private renderNav() {
    const navItems = [
      { path: '/', label: 'Home' },
      { path: '/tasks', label: 'Tasks' },
      { path: '/tasks/new', label: 'New Task' },
    ]

    return html`
      <nav class="bg-white border-b">
        <div class="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
          <span class="font-bold text-lg text-gray-900">Task Manager</span>
          <span .innerHTML=${LIT_ICON}></span>
          <div class="flex gap-4 ml-4">
            ${navItems.map((item) => html`
              <a
                href="#${item.path}"
                class="text-sm ${this.route === item.path ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}"
              >
                ${item.label}
              </a>
            `)}
          </div>
          <a href="http://localhost:1355" class="ml-auto text-xs text-gray-400 hover:text-gray-600">&larr; Dashboard</a>
        </div>
      </nav>
    `
  }

  private renderHome() {
    const pending = this.allTasks.filter((t) => t.status === 'pending').length
    const inProgress = this.allTasks.filter((t) => t.status === 'in-progress').length
    const done = this.allTasks.filter((t) => t.status === 'done').length

    return html`
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div class="text-2xl font-bold text-orange-600">${pending}</div>
            <div class="text-sm text-orange-700">Pending</div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="text-2xl font-bold text-blue-600">${inProgress}</div>
            <div class="text-sm text-blue-700">In Progress</div>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="text-2xl font-bold text-green-600">${done}</div>
            <div class="text-sm text-green-700">Done</div>
          </div>
        </div>
        <a href="#/tasks" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View all tasks &rarr;
        </a>
      </div>
    `
  }

  private renderTasks() {
    return html`
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>
        <search-bar></search-bar>
        <task-filters .categories=${this.categories}></task-filters>
        ${this.loading
          ? html`<p class="text-center text-gray-500 py-8">Loading...</p>`
          : html`
            <task-list
              .tasks=${this.tasks}
              .categories=${this.categories}
              @delete-task=${this.handleDeleteTask}
            ></task-list>
            <task-pagination .totalCount=${this.totalCount}></task-pagination>
          `}
      </div>
    `
  }

  private renderCreateTask() {
    return html`
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Create Task</h1>
        <task-form
          .categories=${this.categories}
          .isSubmitting=${this.submitting}
          @submit-task=${this.handleCreateTask}
        ></task-form>
      </div>
    `
  }

  private renderEditTask() {
    if (!this.editTask) return html`<p class="text-gray-500">Loading...</p>`
    return html`
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
        <task-form
          .categories=${this.categories}
          .defaultValues=${{
            title: this.editTask.title,
            description: this.editTask.description,
            status: this.editTask.status,
            priority: this.editTask.priority,
            categoryId: this.editTask.categoryId,
          }}
          .isSubmitting=${this.submitting}
          @submit-task=${this.handleUpdateTask}
        ></task-form>
      </div>
    `
  }

  private renderPage() {
    if (this.route === '/') return this.renderHome()
    if (this.route === '/tasks') return this.renderTasks()
    if (this.route === '/tasks/new') return this.renderCreateTask()
    if (this.route.match(/^\/tasks\/\d+\/edit$/)) return this.renderEditTask()
    return html`<p class="text-gray-500">Page not found</p>`
  }

  render() {
    return html`
      <div class="min-h-screen bg-gray-50">
        ${this.renderNav()}
        <main class="max-w-5xl mx-auto px-6 py-8">
          ${this.renderPage()}
        </main>
      </div>
    `
  }

  createRenderRoot() { return this }
}
