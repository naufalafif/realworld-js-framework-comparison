<script>
  import '../app.css'
  import { page } from '$app/stores'
  let { children } = $props()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/tasks/new', label: 'New Task' },
  ]
</script>

<div class="min-h-screen bg-gray-50">
  <nav class="bg-white border-b">
    <div class="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
      <span class="font-bold text-lg text-gray-900">Task Manager</span>
      <span>{@html '<svg viewBox="0 0 98.1 118" width="20" height="20"><path d="M91.8 15.6C80.9-.1 59.2-4.7 43.6 5.2L16.1 22.8C8.6 27.5 3.4 35.2 1.9 43.9c-1.3 7.3-.2 14.8 3.3 21.3-2.4 3.6-4 7.6-4.7 11.8-1.6 8.9.5 18.1 5.7 25.4 11 15.7 32.6 20.3 48.2 10.4l27.5-17.6c7.5-4.7 12.7-12.4 14.2-21.1 1.3-7.3.2-14.8-3.3-21.3 2.4-3.6 4-7.6 4.7-11.8 1.7-9-.4-18.2-5.7-25.4" fill="#FF3E00"/><path d="M40.9 103.9a22.7 22.7 0 0 1-9.3-25.5l.6-2.1 1.5 1a50 50 0 0 0 15 7.5l1.4.4-.1 1.4a6.9 6.9 0 0 0 1.2 4.4 7 7 0 0 0 8.6 2.7 6.5 6.5 0 0 0 1.9-1l27.5-17.6a6.3 6.3 0 0 0 2.8-4.5 6.7 6.7 0 0 0-1.2-4.9 7 7 0 0 0-8.6-2.7 6.5 6.5 0 0 0-1.9 1l-10.5 6.7a21.3 21.3 0 0 1-6 3.2 22.4 22.4 0 0 1-17.4-.5 22.7 22.7 0 0 1-9.3-25.5 20.6 20.6 0 0 1 9.2-14.5L74.2 16a21.3 21.3 0 0 1 6-3.2c8.6-3.2 18.1-.6 24.4 6.3a22.7 22.7 0 0 1 3.3 23.4l-.6 2.1-1.5-1a50 50 0 0 0-15-7.5l-1.4-.4.1-1.4a6.9 6.9 0 0 0-1.2-4.4 7 7 0 0 0-8.6-2.7 6.5 6.5 0 0 0-1.9 1L50.3 46.3a6.3 6.3 0 0 0-2.8 4.5c-.2 1.9.3 3.5 1.2 4.9a7 7 0 0 0 8.6 2.7 6.5 6.5 0 0 0 1.9-1l10.5-6.7a21.3 21.3 0 0 1 6-3.2 22.4 22.4 0 0 1 17.4.5 22.7 22.7 0 0 1 9.3 25.5 20.6 20.6 0 0 1-9.2 14.5l-27.5 17.6a21.3 21.3 0 0 1-6 3.2 22.2 22.2 0 0 1-8.8 1" fill="#fff"/></svg>'}</span>
      <div class="flex gap-4 ml-4">
        {#each navItems as item}
          <a
            href={item.path}
            class="text-sm {$page.url.pathname === item.path ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}"
          >
            {item.label}
          </a>
        {/each}
      </div>
    </div>
  </nav>
  <main class="max-w-5xl mx-auto px-6 py-8">
    {@render children()}
  </main>
</div>
