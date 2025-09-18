import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    const confirmed = window.confirm(`Are you sure you want to logout, ${user?.name || 'Admin'}?`)
    if (confirmed) {
      logout()
      navigate('/login')
    }
  }  

  const handleCreateTask = () => {
    navigate('/create-task')
  }

  return (
    <header className="bg-green-600 text-white py-4 px-6 flex justify-between items-center">
      {/* Logo and Admin Name */}
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold">Task Manager</span>
        {user && (
          <span className="font-semibold">Welcome, {user.name}</span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleCreateTask}
          className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-200"
        >
          Create Task
        </button>
        <button
          onClick={handleLogout}
          className="bg-white text-green-600 px-4 py-2 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
