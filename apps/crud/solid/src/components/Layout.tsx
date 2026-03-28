import { A, useLocation } from '@solidjs/router'
import type { ParentProps } from 'solid-js'

export default function Layout(props: ParentProps) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/tasks/new', label: 'New Task' },
  ]

  return (
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white border-b">
        <div class="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
          <span class="font-bold text-lg text-gray-900">Task Manager</span>
          <svg viewBox="0 0 166 155.3" width="20" height="20">
            <path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" fill="#76b3e1"/>
            <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5">
              <stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf0fd"/><stop offset="1" stop-color="#76b3e1"/>
            </linearGradient>
            <path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" opacity=".3" fill="url(#a)"/>
            <path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" fill="#518ac8"/>
            <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2">
              <stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/>
            </linearGradient>
            <path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" opacity=".3" fill="url(#b)"/>
          </svg>
          <div class="flex gap-4 ml-4">
            {navItems.map((item) => (
              <A
                href={item.path}
                class={`text-sm ${location.pathname === item.path ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {item.label}
              </A>
            ))}
          </div>
          <a href="http://localhost:1355" class="ml-auto text-xs text-gray-400 hover:text-gray-600">← Dashboard</a>
        </div>
      </nav>
      <main class="max-w-5xl mx-auto px-6 py-8">
        {props.children}
      </main>
    </div>
  )
}
