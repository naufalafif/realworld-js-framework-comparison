import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// No StrictMode — it double-mounts in dev which kills the WebSocket/PTY connection
createRoot(document.getElementById('root')!).render(<App />)

