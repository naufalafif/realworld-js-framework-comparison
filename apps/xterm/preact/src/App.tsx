import TerminalComponent from './components/Terminal'

const PREACT_ICON = `<svg viewBox="0 0 256 296" width="20" height="20"><path d="M128 0L256 73.9V222.1L128 296L0 222.1V73.9L128 0z" fill="#673AB8"/><path d="M34.865 220.478c17.016 21.78 71.095 5.185 122.15-34.704s81.988-88.196 64.972-109.975c-17.016-21.78-71.095-5.185-122.15 34.704S17.849 198.699 34.865 220.478z" stroke="#fff" stroke-width="16" fill="none"/><path d="M220.875 220.478c-17.016 21.78-71.095 5.185-122.15-34.704S16.737 97.578 33.753 75.799c17.016-21.78 71.095-5.185 122.15 34.704s81.988 88.196 64.972 109.975z" stroke="#fff" stroke-width="16" fill="none"/><circle cx="128" cy="148" r="17" fill="#fff"/></svg>`

export default function App() {
  return (
    <div class="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <div class="flex items-center gap-3 px-6 py-3 bg-gray-800 border-b border-gray-700 shrink-0">
        <h1 class="text-lg font-bold text-green-400">Terminal</h1>
        <span dangerouslySetInnerHTML={{ __html: PREACT_ICON }} />
        <a href="http://localhost:1355" class="ml-auto text-xs text-gray-500 hover:text-gray-300">← Dashboard</a>
      </div>
      <div class="flex-1 min-h-0">
        <TerminalComponent wsUrl="ws://localhost:3200" />
      </div>
    </div>
  )
}
