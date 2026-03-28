import { Router, Route } from '@solidjs/router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import TaskCreate from './pages/TaskCreate'
import TaskEdit from './pages/TaskEdit'

export default function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={Home} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/tasks/new" component={TaskCreate} />
      <Route path="/tasks/:id/edit" component={TaskEdit} />
    </Router>
  )
}
