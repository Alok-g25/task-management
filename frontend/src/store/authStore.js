import { create } from 'zustand'
import Cookies from 'js-cookie'
import { axiosInstance } from '../lib/axios'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  users: [], // Add users state

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.post('/users/login', { email, password })
      set({ token: res.data.token, loading: false })
      Cookies.set('token', res.data.token)
    } catch (err) {
      set({
        error: err.response?.data?.message || err.response?.data?.msg || err.message || 'Login failed',
        loading: false
      })

    }
  },
  signup: async (name, email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.post('/users/register', { name, email, password })
      set({ token: res.data.token, loading: false })
      Cookies.set('token', res.data.token)
    } catch (err) {
      set({
        error: err.response?.data?.message || err.response?.data?.msg || err.message || 'Signup failed',
        loading: false
      })
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      users: [],
      error: null,
      loading: false
    })
    Cookies.remove('token')
  },

  fetchAllUsers: async () => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.get('/users/fetch') // call your API
      set({ users: res.data.users, loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || err.response?.data?.msg || err.message || 'Failed to fetch users',
        loading: false
      })
    }
  },
  fetchCurrentUser: async () => {
    set({ loading: true, error: null })
    try {
      const res = await axiosInstance.get('/users/details')
      set({ user: res.data.user, loading: false })
    } catch (err) {
      set({
        error: err.response?.data?.message || err.response?.data?.msg || err.message || 'Failed to fetch current user',
        user: null,
        token: null,
        loading: false
      })
    }
  }
}))
