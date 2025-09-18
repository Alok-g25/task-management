import { useEffect, useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'

export default function TaskTable() {
  const {
    tasks,
    page,
    limit,
    total,
    loading,
    error,
    getAllTasks,
    deleteTask,
  } = useTaskStore()

  const { user } = useAuthStore() // current logged-in user

  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    assignedTo: ''
  })

  const [filteredTasks, setFilteredTasks] = useState(tasks)

  useEffect(() => {
    getAllTasks(page, limit)
  }, [page, limit])

  useEffect(() => {
    let temp = [...tasks]

    if (filters.priority) temp = temp.filter(task => task.priority === filters.priority)
    if (filters.status) temp = temp.filter(task => task.status === filters.status)
    if (filters.assignedTo) temp = temp.filter(task => task.assignedTo?._id === filters.assignedTo)

    setFilteredTasks(temp)
  }, [tasks, filters])

  const handleDelete = (id) => deleteTask(id)
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  const assignedUsers = Array.from(
    new Map(
      tasks
        .map(t => t.assignedTo)
        .filter(Boolean)
        .map(u => [u._id, u])
    ).values()
  )

  const totalPages = Math.ceil(total / limit)

  return (
    <div>
      {/* Filters Section */}
      <div className="p-4 bg-gray-50 mb-6 rounded shadow flex flex-wrap gap-6 items-end">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Filter by Priority</label>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded"
          >
            <option value="">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Filter by Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Filter by Assigned User</label>
          <select
            name="assignedTo"
            value={filters.assignedTo}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded"
          >
            <option value="">All</option>
            {assignedUsers.map(u => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto">
        {loading && <p className="text-center py-4">Loading tasks...</p>}
        {error && <p className="text-center py-4 text-red-500">{error}</p>}

        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Due Date</th>
              <th className="py-2 px-4">Priority</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Created By</th>
              <th className="py-2 px-4">Assigned To</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 && !loading && (
              <tr>
                <td colSpan="9" className="text-center py-4">No tasks found.</td>
              </tr>
            )}

            {filteredTasks.map((task, index) => {
              const canEdit = user?._id === task.createdBy?._id
              return (
                <tr key={task._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4">{index + 1 + (page - 1) * limit}</td>
                  <td className="py-2 px-4">{task.title}</td>
                  <td className="py-2 px-4">{task.description.slice(0, 50)}</td>
                  <td className="py-2 px-4">{new Date(task.dueDate).toLocaleDateString()}</td>

                  <td className={`py-1 px-3 rounded text-center font-semibold ${task.priority === 'high' ? 'text-red-800' :
                    task.priority === 'medium' ? 'text-yellow-800' :
                      'text-green-800'
                    }`}>
                    {task.priority}
                  </td>

                  <td className={`py-1 px-3 rounded text-center font-semibold ${task.status === 'pending' ? 'text-orange-800' : 'text-green-800'
                    }`}>
                    {task.status}
                  </td>

                  <td className="py-2 px-4">{task.createdBy?.name}</td>
                  <td className="py-2 px-4">{task.assignedTo?.name}</td>
                  <td className="py-2 px-4 flex gap-2">
                    {canEdit && (
                      <>
                        <Link
                          to={`/edit-task/${task._id}`}
                          className="px-3 py-1 rounded text-white bg-blue-500 hover:bg-blue-600"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(task._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              disabled={page === 1}
              onClick={() => getAllTasks(page - 1, limit)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => getAllTasks(p, limit)}
                className={`px-3 py-1 rounded ${p === page ? 'bg-green-600 text-white' : 'bg-gray-200'
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => getAllTasks(page + 1, limit)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
