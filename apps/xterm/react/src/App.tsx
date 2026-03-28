import TerminalComponent from './components/Terminal'

export default function App() {
  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-3 bg-gray-800 border-b border-gray-700 shrink-0">
        <h1 className="text-lg font-bold text-green-400">Terminal</h1>
        <span dangerouslySetInnerHTML={{ __html: '<svg viewBox="-11.5 -10.232 23 20.463" width="20" height="20"><circle r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" fill="none" stroke-width="1"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>' }} />
      </div>
      <div className="flex-1 min-h-0">
        <TerminalComponent wsUrl="ws://localhost:3200" />
      </div>
    </div>
  )
}
