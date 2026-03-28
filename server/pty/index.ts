import { WebSocketServer, WebSocket, type RawData } from 'ws'
import * as pty from 'node-pty'

const PORT = 3200

const wss = new WebSocketServer({ port: PORT })

console.log(`PTY WebSocket server running on ws://localhost:${PORT}`)

// Minimal env — avoid leaking secrets from the developer's environment
function getSafeEnv(): Record<string, string> {
  return {
    TERM: 'xterm-256color',
    PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
    HOME: process.env.HOME || '/',
    SHELL: process.env.SHELL || 'bash',
    LANG: process.env.LANG || 'en_US.UTF-8',
    USER: process.env.USER || '',
    COLORTERM: 'truecolor',
  }
}

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected')

  let ptyProcess: pty.IPty | null = null

  try {
    const shell = process.env.SHELL || 'bash'
    ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-256color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME || '/',
      env: getSafeEnv(),
    })
  } catch (err) {
    console.error('Failed to spawn PTY:', err)
    ws.close()
    return
  }

  const ptyProc = ptyProcess

  ptyProc.onData((data: string) => {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data)
      }
    } catch {
      // ignore send errors
    }
  })

  ptyProc.onExit(({ exitCode }) => {
    console.log(`PTY exited with code ${exitCode}`)
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    } catch {
      // ignore close errors
    }
  })

  ws.on('message', (data: RawData) => {
    const msg = data.toString()

    try {
      const parsed = JSON.parse(msg)
      if (parsed.type === 'resize' && typeof parsed.cols === 'number' && typeof parsed.rows === 'number') {
        ptyProc.resize(Math.max(1, Math.min(parsed.cols, 500)), Math.max(1, Math.min(parsed.rows, 200)))
        return
      }
    } catch {
      // Not JSON, treat as terminal input
    }

    try {
      ptyProc.write(msg)
    } catch {
      // ignore write errors (pty may have exited)
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
    try {
      ptyProc.kill()
    } catch {
      // ignore kill errors
    }
  })

  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message)
  })
})

wss.on('error', (err) => {
  console.error('Server error:', err.message)
})

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message)
})
