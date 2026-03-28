import Terminal from './components/Terminal'

const SOLID_ICON = `<svg viewBox="0 0 166 155.3" width="20" height="20"><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" fill="#76b3e1"/><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="27.5" y1="3" x2="152" y2="63.5"><stop offset=".1" stop-color="#76b3e1"/><stop offset=".3" stop-color="#dcf0fd"/><stop offset="1" stop-color="#76b3e1"/></linearGradient><path d="M163 35S110-4 69 5 15 41 15 41s-23 28-7 61 68 44 68 44 47 10 73-11 14-49 14-49" opacity=".3" fill="url(#a)"/><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" fill="#518ac8"/><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="95.8" y1="32.6" x2="74" y2="105.2"><stop offset="0" stop-color="#76b3e1"/><stop offset=".5" stop-color="#4377bb"/><stop offset="1" stop-color="#1f3b77"/></linearGradient><path d="M52 35S-5 74 8 107s68 44 68 44 47 10 73-11 14-49 14-49-48-39-89-30-22 26-22 26" opacity=".3" fill="url(#b)"/></svg>`

export default function App() {
  return (
    <div class="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <div class="flex items-center gap-3 px-6 py-3 bg-gray-800 border-b border-gray-700 shrink-0">
        <h1 class="text-lg font-bold text-green-400">Terminal</h1>
        <span innerHTML={SOLID_ICON} />
      </div>
      <div class="flex-1 min-h-0">
        <Terminal wsUrl="ws://localhost:3200" />
      </div>
    </div>
  )
}
