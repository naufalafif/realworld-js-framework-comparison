import { Link, Outlet, useLocation } from 'react-router'

export default function Layout() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/tasks/new', label: 'New Task' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
          <span className="font-bold text-lg text-gray-900">Task Manager</span>
          <span dangerouslySetInnerHTML={{ __html: '<svg viewBox="-11.5 -10.232 23 20.463" width="20" height="20"><circle r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" fill="none" stroke-width="1"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>' }} />
          <div className="flex gap-4 ml-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm ${location.pathname === item.path ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
