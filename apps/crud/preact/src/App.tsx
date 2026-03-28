import Router from 'preact-router'
import Nav from './components/Nav'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import TaskCreate from './pages/TaskCreate'
import TaskEdit from './pages/TaskEdit'

export default function App() {
  return (
    <div class="min-h-screen bg-gray-50">
      <Nav />
      <main class="max-w-5xl mx-auto px-6 py-8">
        <Router>
          <Home path="/" />
          <Tasks path="/tasks" />
          <TaskCreate path="/tasks/new" />
          <TaskEdit path="/tasks/:id/edit" />
        </Router>
      </main>
    </div>
  )
}
