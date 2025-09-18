// pages/EditTask.jsx
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useTaskStore } from '../store/taskStore'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'

export default function EditTask() {
    const navigate = useNavigate()
    const { id } = useParams() // task ID from URL

    const { users, fetchAllUsers } = useAuthStore()
    const { currentTask, getTaskById, updateTask, loading, error } = useTaskStore()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [priority, setPriority] = useState('medium')
    const [assignedTo, setAssignedTo] = useState('')
    const [status, setStatus] = useState('pending') // New state for status

    useEffect(() => {
        fetchAllUsers()
        getTaskById(id)
    }, [id])

    useEffect(() => {
        if (currentTask) {
            setTitle(currentTask.title)
            setDescription(currentTask.description)
            setDueDate(currentTask.dueDate.slice(0, 10))
            setPriority(currentTask.priority)
            setAssignedTo(currentTask.assignedTo?._id || '')
            setStatus(currentTask.status) // populate status
        }
    }, [currentTask])

    console.log(currentTask)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title || !description || !dueDate || !assignedTo) {
            alert('Please fill in all required fields.')
            return
        }

        const taskData = { title, description, dueDate, priority, assignedTo, status }
        await updateTask(id, taskData)
        navigate('/') // redirect to home
    }

    return (
        <>
            <Header />
            <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Task</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold">Assign To</label>
                            <select
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required
                            >
                                <option value="">Select User</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>{user.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-semibold">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            rows={4}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                        {loading ? 'Updating...' : 'Update Task'}
                    </button>
                </form>
            </div>
        </>
    )
}
