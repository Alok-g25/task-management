// pages/Home.jsx
import { useEffect } from 'react'
import Header from '../components/Header'
import TaskTable from '../components/TaskTable'
import { useAuthStore } from '../store/authStore'

export default function Home() {
  const { user, fetchCurrentUser } = useAuthStore()

  useEffect(() => {
    if (!user) {
      fetchCurrentUser()
    }
  }, [user, fetchCurrentUser])

  const handleCreateTask = () => {
    // open create task modal or navigate
    // setShowTaskModal(true) if you are using modal
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header>
        <button
          onClick={handleCreateTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </Header>

      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
        <TaskTable />
      </main>
    </div>
  )
}
