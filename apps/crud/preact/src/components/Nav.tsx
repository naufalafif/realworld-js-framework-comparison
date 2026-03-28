import { useState, useEffect } from 'preact/hooks'

const PREACT_ICON = `<svg viewBox="0 0 256 296" width="20" height="20"><path d="M128 0L256 73.9V222.1L128 296L0 222.1V73.9L128 0z" fill="#673AB8"/><path d="M34.865 220.478c17.016 21.78 71.095 5.185 122.15-34.704s81.988-88.196 64.972-109.975c-17.016-21.78-71.095-5.185-122.15 34.704S17.849 198.699 34.865 220.478z" stroke="#fff" stroke-width="16" fill="none"/><path d="M220.875 220.478c-17.016 21.78-71.095 5.185-122.15-34.704S16.737 97.578 33.753 75.799c17.016-21.78 71.095-5.185 122.15 34.704s81.988 88.196 64.972 109.975z" stroke="#fff" stroke-width="16" fill="none"/><circle cx="128" cy="148" r="17" fill="#fff"/></svg>`

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/tasks', label: 'Tasks' },
  { path: '/tasks/new', label: 'New Task' },
]

export default function Nav() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const onRoute = () => setCurrentPath(window.location.pathname)
    addEventListener('popstate', onRoute)
    // preact-router uses pushState, so also listen for custom route events
    const origPushState = history.pushState.bind(history)
    history.pushState = (...args: Parameters<typeof history.pushState>) => {
      origPushState(...args)
      onRoute()
    }
    return () => {
      removeEventListener('popstate', onRoute)
      history.pushState = origPushState
    }
  }, [])

  return (
    <nav class="bg-white border-b">
      <div class="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
        <span class="font-bold text-lg text-gray-900">Task Manager</span>
        <span dangerouslySetInnerHTML={{ __html: PREACT_ICON }} />
        <div class="flex gap-4 ml-4">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              class={`text-sm ${currentPath === item.path ? 'text-purple-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <a href="http://localhost:1355" class="ml-auto text-xs text-gray-400 hover:text-gray-600">← Dashboard</a>
      </div>
    </nav>
  )
}
