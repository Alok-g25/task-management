import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import './index.css'
import ProtectedRoute from './middleware/ProtectedRoute'
import CreateTask from './pages/CreateTask'
import EditTask from './pages/EditTask'

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create-task" element={
        <ProtectedRoute>
          <CreateTask />
        </ProtectedRoute>
      } />
      <Route path="/edit-task/:id" element={
        <ProtectedRoute>
          <EditTask />
        </ProtectedRoute>
      } />
    </Routes>
  )
}
