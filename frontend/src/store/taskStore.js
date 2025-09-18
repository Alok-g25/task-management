// store/taskStore.js
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'

export const useTaskStore = create((set, get) => ({
  tasks: [],
  currentTask: null,
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,

  // Fetch tasks with pagination
  getAllTasks: async (page = 1, limit = 10) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.get(`/tasks?page=${page}&limit=${limit}`)
      set({
        tasks: res.data.tasks,
        total: res.data.total,
        page,
        limit,
        loading: false
      })
    } catch (err) {
      set({
        error: err.response?.data?.message || err.response?.data?.msg || err.message || 'Failed to fetch tasks',
        loading: false
      })
    }
  },

  // Get single task by ID
  getTaskById: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.get(`/tasks/${id}`)
      set({ currentTask: res.data.task, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.response?.data?.msg || err.message || 'Failed to fetch task', loading: false })
    }
  },

  // Add a new task
  addTask: async (taskData) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.post('/tasks', taskData)
      set({ tasks: [...get().tasks, res.data.task], loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.response?.data?.msg || err.message || 'Failed to add task', loading: false })
    }
  },

  // Update task by ID
  updateTask: async (id, taskData) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.put(`/tasks/${id}`, taskData)
      const updatedTasks = get().tasks.map(task =>
        task._id === id ? res.data.task : task
      )
      set({ tasks: updatedTasks, loading: false })
      console.log(updatedTasks)
    } catch (err) {
        console.log(err.response?.data?.message)
      set({ error: err.response?.data?.message || err.response?.data?.msg || err.message || 'Failed to update task', loading: false })
    }
  },

  // Delete task by ID
  deleteTask: async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?")
    if (!confirmed) return
    set({ loading: true, error: null })
    try {
      await axiosInstance.delete(`/tasks/${id}`)
      const filteredTasks = get().tasks.filter(task => task._id !== id)
      set({ tasks: filteredTasks, loading: false })
    } catch (err) {
      set({ error: err.response?.data?.message || err.response?.data?.msg || err.message || 'Failed to delete task', loading: false })
    }
  }
}))
